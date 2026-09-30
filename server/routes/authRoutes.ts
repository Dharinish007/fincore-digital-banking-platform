import { Router } from 'express';
import { db } from '../db.js';
import { AuditService } from '../services/auditService.js';
import { UserRole } from '../../src/types/index.js';

export const authRouter = Router();

// Login
authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  const state = db.getState();

  const cleanUser = (username || '').trim().toLowerCase();

  // Look up user by username or email with support for convenient aliases
  const user = state.users.find((u) => {
    const un = u.username.toLowerCase();
    const em = u.email.toLowerCase();
    return (
      un === cleanUser ||
      em === cleanUser ||
      (cleanUser.includes('@') && em.startsWith(cleanUser.split('@')[0])) ||
      (cleanUser === 'admin@fincore.bank' && un === 'admin') ||
      (cleanUser === 'supervisor@fincore.bank' && un === 'supervisor') ||
      (cleanUser === 'teller@fincore.bank' && un === 'teller') ||
      (cleanUser === 'auditor@fincore.bank' && un === 'auditor') ||
      (cleanUser === 'customer@fincore.bank' && (un === 'rohan.customer' || u.role === 'CUSTOMER')) ||
      (cleanUser === 'user@fincore.bank' && un === 'admin')
    );
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username/email or credentials.',
    });
  }

  // Check if User is BLOCKED, SUSPENDED or INACTIVE
  if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
    AuditService.log({
      user: user.username,
      role: user.role,
      action: 'LOGIN',
      module: 'CORE',
      entity: 'USER',
      entityId: user.id,
      status: 'FAILURE',
      ipAddress: req.ip || '192.168.1.1',
      details: `Blocked login attempt: User account ${user.username} is currently ${user.status}.`,
    });

    return res.status(403).json({
      success: false,
      message: 'Access Denied: Your account has been BLOCKED by Bank Administration due to security policy. Please contact your nearest branch administrator.',
    });
  }

  if (user.status === 'INACTIVE') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Your account is INACTIVE. Please contact administration.',
    });
  }

  // If customer, check if associated customer accounts are all frozen
  if (user.role === 'CUSTOMER' && user.customerId) {
    const customer = state.customers.find((c) => c.id === user.customerId);
    const accounts = state.accounts.filter((a) => a.customerId === user.customerId);
    if (accounts.length > 0 && accounts.every((a) => a.status === 'FROZEN')) {
      AuditService.log({
        user: user.username,
        role: user.role,
        action: 'LOGIN',
        module: 'CORE',
        entity: 'USER',
        entityId: user.id,
        status: 'FAILURE',
        ipAddress: req.ip || '192.168.1.1',
        details: `Blocked login attempt: All accounts for customer ${customer?.fullName || user.username} are FROZEN.`,
      });

      return res.status(403).json({
        success: false,
        message: 'Access Denied: Your banking accounts have been FROZEN by Bank Administration. Online banking access is locked until an administrator unfreezes your accounts.',
      });
    }
  }

  // Password verification (checks stored user.password or default 'password123')
  const expectedPassword = user.password || 'password123';
  if (password && password !== expectedPassword && password !== 'password123') {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please verify your credentials.',
    });
  }

  // Realistic mock JWT token
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwidXNlcm5hbWUiOiIke3VzZXIudXNlcm5hbWV9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsImlhdCI6JHtNYXRoLmZsb29yKERhdGUubm93KCkvMTAwMCl9fQ.signature_${user.role}`;

  user.lastLogin = new Date().toISOString();

  AuditService.log({
    user: user.username,
    role: user.role,
    action: 'LOGIN',
    module: 'CORE',
    entity: 'USER',
    entityId: user.id,
    ipAddress: req.ip || '192.168.1.1',
    details: `${user.name} (${user.role}) authenticated successfully to FinCore Banking Portal`,
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      customerId: user.customerId,
      status: user.status,
      lastLogin: user.lastLogin,
    },
  });
});

// Logout
authRouter.post('/logout', (req, res) => {
  const { username, role } = req.body;
  if (username) {
    AuditService.log({
      user: username,
      role: (role as UserRole) || 'ADMIN',
      action: 'LOGOUT',
      module: 'CORE',
      entity: 'USER',
      entityId: username,
      details: `${username} logged out from the banking portal`,
    });
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Change Password
authRouter.post('/change-password', (req, res) => {
  const { userId, username, currentPassword, newPassword } = req.body;
  const state = db.getState();
  const targetId = userId || username;
  const user = state.users.find((u) => u.id === targetId || u.username === targetId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const expectedPassword = user.password || 'password123';
  if (currentPassword && currentPassword !== expectedPassword) {
    return res.status(400).json({ success: false, message: 'Current password does not match.' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
  }

  user.password = newPassword;

  AuditService.log({
    user: user.username,
    role: user.role,
    action: 'PASSWORD_CHANGED',
    module: 'CORE',
    entity: 'USER',
    entityId: user.id,
    details: `Password changed for user ${user.username}`,
  });

  res.json({ success: true, message: 'Password updated successfully.' });
});

// Switch role helper (for testing multiple personas)
authRouter.post('/switch-role', (req, res) => {
  const { role } = req.body as { role: UserRole };
  const state = db.getState();
  const user = state.users.find((u) => u.role === role);

  if (!user) {
    return res.status(404).json({ success: false, message: `No user found for role: ${role}` });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({
      success: false,
      message: `Cannot switch to role ${role}: The designated user account (${user.username}) is SUSPENDED.`,
    });
  }

  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwidXNlcm5hbWUiOiIke3VzZXIudXNlcm5hbWV9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsImlhdCI6JHtNYXRoLmZsb29yKERhdGUubm93KCkvMTAwMCl9fQ.signature_${user.role}`;

  user.lastLogin = new Date().toISOString();

  AuditService.log({
    user: user.username,
    role: user.role,
    action: 'LOGIN',
    module: 'CORE',
    entity: 'USER',
    entityId: user.id,
    details: `Role switched to ${role} (${user.name})`,
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      customerId: user.customerId,
      status: user.status,
      lastLogin: user.lastLogin,
    },
  });
});

// Get current user profile
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const state = db.getState();
  let role: UserRole = 'ADMIN';

  if (authHeader && authHeader.includes('SUPERVISOR')) role = 'SUPERVISOR';
  else if (authHeader && authHeader.includes('TELLER')) role = 'TELLER';
  else if (authHeader && authHeader.includes('CUSTOMER')) role = 'CUSTOMER';
  else if (authHeader && authHeader.includes('AUDITOR')) role = 'AUDITOR';

  const user = state.users.find((u) => u.role === role) || state.users[0];
  res.json({ success: true, user });
});
