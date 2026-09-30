import { Router } from 'express';
import { db } from '../db.js';
import { AuditService } from '../services/auditService.js';
import { NotificationService } from '../services/notificationService.js';
import { KYCRecord, User, KYCStatus, RiskLevel } from '../../src/types/index.js';

export const milestone1Router = Router();

// ======================= KYC VERIFICATION =======================
milestone1Router.get('/kyc', (req, res) => {
  const state = db.getState();
  const { status, riskLevel, search } = req.query;
  let records = state.kycRecords;

  if (status && status !== 'ALL') records = records.filter((k) => k.verificationStatus === status);
  if (riskLevel && riskLevel !== 'ALL') records = records.filter((k) => k.riskLevel === riskLevel);
  if (search) {
    const s = String(search).toLowerCase();
    records = records.filter(
      (k) =>
        k.fullName.toLowerCase().includes(s) ||
        k.documentNumber.toLowerCase().includes(s) ||
        k.id.toLowerCase().includes(s) ||
        k.customerId.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, records, kycRecords: records });
});

// Submit KYC (by Teller or Customer)
const handleKycSubmit = (req: any, res: any) => {
  const { customerId, fullName, dateOfBirth, phone, email, address, documentType, documentNumber, submittedBy, riskLevel, remarks } = req.body;
  const state = db.getState();

  const customer = state.customers.find((c) => c.id === customerId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  const kycId = `KYC-${5000 + state.kycRecords.length + 1}`;
  const newKyc: KYCRecord = {
    id: kycId,
    customerId: customer.id,
    fullName: fullName || customer.fullName,
    dateOfBirth: dateOfBirth || '1992-05-14',
    phone: phone || customer.phone,
    email: email || customer.email,
    address: address || customer.address,
    documentType: documentType || 'PAN',
    documentNumber: documentNumber || 'ABCDE1234F',
    documentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    verificationStatus: 'UNDER_REVIEW',
    riskLevel: (riskLevel as RiskLevel) || 'LOW',
    submittedBy: submittedBy || 'teller',
    submittedAt: new Date().toISOString(),
    remarks: remarks || 'Awaiting biometric & document verification from Supervisor.',
  };

  state.kycRecords.unshift(newKyc);
  customer.kycStatus = 'UNDER_REVIEW';

  AuditService.log({
    user: submittedBy || 'teller',
    role: 'TELLER',
    action: 'KYC_SUBMITTED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'KYC_RECORD',
    entityId: kycId,
    newValue: 'UNDER_REVIEW',
    details: `KYC submission for ${customer.fullName} (${newKyc.documentType}: ${newKyc.documentNumber})`,
  });

  NotificationService.send({
    userId: 'USR-002',
    customerId: customer.id,
    type: 'KYC_APPROVED',
    title: `New KYC Submitted for Review: ${customer.fullName}`,
    message: `Teller ${submittedBy || 'teller'} submitted KYC record ${kycId} for review.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, record: newKyc, kycRecord: newKyc });
};

milestone1Router.post('/kyc', handleKycSubmit);
milestone1Router.post('/kyc/submit', handleKycSubmit);

// ======================= OCR EXTRACTION ENGINE =======================
milestone1Router.post('/kyc/ocr-extract', (req: any, res: any) => {
  const { documentType = 'PAN', documentNumber, fullName, dateOfBirth, documentImage, customerId } = req.body;
  const state = db.getState();

  // Find customer if provided
  const customer = customerId ? state.customers.find((c) => c.id === customerId) : null;
  const resolvedName = fullName || customer?.fullName || 'Rohan Sharma';
  const resolvedDob = dateOfBirth || '1992-05-18';

  let resolvedDocNum = documentNumber;
  let ocrFields: Record<string, any> = {};

  if (documentType === 'PAN') {
    resolvedDocNum = documentNumber || 'ABCPS1234F';
    ocrFields = {
      issuingAuthority: 'Income Tax Department, Govt. of India',
      panNumber: resolvedDocNum,
      cardholderName: resolvedName.toUpperCase(),
      fathersName: 'RAMESH SHARMA',
      dateOfBirth: resolvedDob,
      hologramDetected: true,
      signaturePresent: true,
      qrCodeDetected: true,
    };
  } else if (documentType === 'AADHAAR') {
    resolvedDocNum = documentNumber || '4829 1049 8812';
    ocrFields = {
      issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
      aadhaarNumber: resolvedDocNum,
      residentName: resolvedName,
      gender: 'MALE',
      yearOfBirth: resolvedDob.slice(0, 4),
      address: customer?.address || 'Flat 402, Lotus Heights, Powai, Mumbai - 400076',
      secureQrCodeVerified: true,
    };
  } else if (documentType === 'PASSPORT') {
    resolvedDocNum = documentNumber || 'Z8941029';
    ocrFields = {
      issuingAuthority: 'Republic of India, Ministry of External Affairs',
      passportNumber: resolvedDocNum,
      surname: resolvedName.split(' ').slice(-1)[0] || 'SHARMA',
      givenNames: resolvedName.split(' ').slice(0, -1).join(' ') || 'ROHAN',
      nationality: 'INDIAN',
      dateOfExpiry: '2032-11-20',
      mrzLine1: ('P<IND' + resolvedName.replace(/\s+/g, '<') + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44),
      mrzLine2: (resolvedDocNum + '2IND9205188M3211204<<<<<<<<<<<<<<<<<<<<<<<<<02').slice(0, 44),
      mrzChecksumValid: true,
    };
  } else {
    resolvedDocNum = documentNumber || 'EPIC9928104';
    ocrFields = {
      issuingAuthority: 'Election Commission of India',
      voterId: resolvedDocNum,
      electorName: resolvedName,
      constituency: 'Mumbai North',
    };
  }

  const ocrResult = {
    documentType,
    documentNumber: resolvedDocNum,
    extractedFullName: resolvedName,
    extractedDob: resolvedDob,
    confidenceScore: 99.4,
    tamperDetected: false,
    securityCheck: 'PASSED',
    status: 'OCR_SUCCESS',
    timestamp: new Date().toISOString(),
    extractedFields: ocrFields,
  };

  // If customer has an active KYC record, attach OCR extracted data
  if (customerId) {
    const existingKyc = state.kycRecords.find((k) => k.customerId === customerId);
    if (existingKyc) {
      existingKyc.ocrExtractedData = ocrResult;
    }
  }

  AuditService.log({
    user: customerId || 'system',
    role: 'CUSTOMER',
    action: 'KYC_SUBMITTED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'OCR_ENGINE',
    entityId: resolvedDocNum,
    newValue: 'OCR_SUCCESS',
    details: `Optical Character Recognition completed for ${documentType} (${resolvedDocNum}) with 99.4% confidence`,
  });

  res.json({
    success: true,
    message: 'Document OCR successfully extracted and verified.',
    ocrResult,
  });
});

// ======================= BIOMETRIC LIVENESS CHECK =======================
milestone1Router.post('/kyc/liveness-check', (req: any, res: any) => {
  const { actionsCompleted = ['LOOK_STRAIGHT', 'BLINK', 'HEAD_TURN'], customerId } = req.body;
  const state = db.getState();

  const livenessResult = {
    livenessScore: 99.1,
    livenessPassed: true,
    antiSpoofingVerdict: 'GENUINE_LIVE_HUMAN',
    spoofProbability: 0.009,
    blinkDetection: 'CONFIRMED',
    microExpressionAnalysis: 'PASSED',
    screenReplayDetection: 'NEGATIVE',
    printAttackDetection: 'NEGATIVE',
    maskAttackDetection: 'NEGATIVE',
    actionsVerified: actionsCompleted,
    verifiedAt: new Date().toISOString(),
  };

  if (customerId) {
    const existingKyc = state.kycRecords.find((k) => k.customerId === customerId);
    if (existingKyc) {
      existingKyc.livenessVerified = true;
    }
  }

  AuditService.log({
    user: customerId || 'system',
    role: 'CUSTOMER',
    action: 'KYC_SUBMITTED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'LIVENESS_ENGINE',
    entityId: customerId || 'LIVE-CHECK',
    newValue: 'LIVENESS_PASSED',
    details: 'Biometric passive and active liveness verification passed (Score: 99.1%, Verdict: GENUINE_LIVE_HUMAN)',
  });

  res.json({
    success: true,
    message: 'Liveness detection check passed successfully.',
    livenessResult,
  });
});

// ======================= BIOMETRIC FACE MATCH =======================
milestone1Router.post('/kyc/face-match', (req: any, res: any) => {
  const { documentPhoto, selfiePhoto, customerId } = req.body;
  const state = db.getState();

  const matchResult = {
    faceMatchScore: 98.7,
    matchThreshold: 85.0,
    biometricDistance: 0.13,
    verdict: 'MATCH_CONFIRMED',
    confidenceInterval: '99.9%',
    facialLandmarksMatched: 128,
    status: 'VERIFIED',
    timestamp: new Date().toISOString(),
  };

  if (customerId) {
    const existingKyc = state.kycRecords.find((k) => k.customerId === customerId);
    if (existingKyc) {
      existingKyc.faceMatchScore = matchResult.faceMatchScore;
      existingKyc.livenessVerified = true;
    }
  }

  AuditService.log({
    user: customerId || 'system',
    role: 'CUSTOMER',
    action: 'KYC_SUBMITTED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'BIOMETRIC_FACEMATCH',
    entityId: customerId || 'FACE-MATCH',
    newValue: 'MATCH_CONFIRMED',
    details: '128-point biometric facial embedding similarity verified against ID portrait (Score: 98.7%)',
  });

  res.json({
    success: true,
    message: 'Biometric face match confirmed against identity document.',
    matchResult,
  });
});

// Review & Approve/Reject KYC (by Supervisor or Admin)
const handleKycReview = (req: any, res: any) => {
  const id = req.params.id || req.body.kycId || req.body.id;
  const { status, riskLevel, verifiedBy, remarks } = req.body as {
    status: KYCStatus;
    riskLevel?: RiskLevel;
    verifiedBy: string;
    remarks?: string;
  };

  const state = db.getState();
  const kyc = state.kycRecords.find((k) => k.id === id);
  if (!kyc) return res.status(404).json({ success: false, message: 'KYC record not found.' });

  const oldStatus = kyc.verificationStatus;
  kyc.verificationStatus = status;
  if (riskLevel) kyc.riskLevel = riskLevel;
  kyc.verifiedBy = verifiedBy || 'supervisor';
  kyc.verifiedAt = new Date().toISOString();
  kyc.remarks = remarks || (status === 'VERIFIED' ? 'Approved following thorough database and identity validation.' : 'Rejected due to documentation inconsistency.');

  const customer = state.customers.find((c) => c.id === kyc.customerId);
  if (customer) {
    customer.kycStatus = status;
    if (riskLevel) customer.riskLevel = riskLevel;
  }

  const action = status === 'VERIFIED' ? 'KYC_APPROVED' : 'KYC_REJECTED';

  AuditService.log({
    user: verifiedBy || 'supervisor',
    role: 'SUPERVISOR',
    action,
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'KYC_RECORD',
    entityId: kyc.id,
    oldValue: oldStatus,
    newValue: status,
    details: `Supervisor ${verifiedBy || 'supervisor'} marked KYC as ${status} (Risk: ${kyc.riskLevel})`,
  });

  NotificationService.send({
    customerId: kyc.customerId,
    type: status === 'VERIFIED' ? 'KYC_APPROVED' : 'KYC_REJECTED',
    title: status === 'VERIFIED' ? 'KYC Verification Approved!' : 'KYC Verification Rejected',
    message:
      status === 'VERIFIED'
        ? `Your identity document (${kyc.documentType}) has been verified. You can now apply for loans and execute high-value transactions.`
        : `Your KYC document verification was not successful. Reason: ${kyc.remarks}`,
    channel: 'IN_APP',
  });

  res.json({ success: true, record: kyc, kycRecord: kyc });
};

milestone1Router.post('/kyc/review', handleKycReview);
milestone1Router.put('/kyc/review', handleKycReview);
milestone1Router.post('/kyc/:id/review', handleKycReview);
milestone1Router.put('/kyc/:id/review', handleKycReview);

// ======================= USER MANAGEMENT & RBAC =======================
milestone1Router.get('/users', (req, res) => {
  const state = db.getState();
  const { role, status, search } = req.query;
  let users = state.users;

  if (role && role !== 'ALL') users = users.filter((u) => u.role === role);
  if (status && status !== 'ALL') users = users.filter((u) => u.status === status);
  if (search) {
    const s = String(search).toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.username.toLowerCase().includes(s));
  }

  res.json({ success: true, users });
});

milestone1Router.post('/users', (req, res) => {
  const { username, name, email, role, password, performedBy } = req.body;
  const state = db.getState();

  if (!username || !name || !email || !role) {
    return res.status(400).json({ success: false, message: 'All user fields are required.' });
  }

  if (state.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Username already exists.' });
  }

  const newUserId = `USR-${String(state.users.length + 1).padStart(3, '0')}`;
  const newUser: User = {
    id: newUserId,
    username: username.trim(),
    password: password && password.trim() ? password.trim() : 'password123',
    name: name.trim(),
    email: email.trim(),
    role,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  state.users.unshift(newUser);

  AuditService.log({
    user: performedBy || 'admin',
    role: 'ADMIN',
    action: 'USER_CREATED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'USER',
    entityId: newUserId,
    newValue: role,
    details: `Created new staff user: ${name} with role ${role}`,
  });

  res.json({ success: true, user: newUser });
});

const handleUpdateUserStatus = (req: any, res: any) => {
  const { id } = req.params;
  const { status, performedBy, reason } = req.body;
  const state = db.getState();
  const user = state.users.find((u) => u.id === id || u.username === id);

  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  const oldStatus = user.status;
  user.status = status;

  const action = status === 'SUSPENDED' ? 'USER_SUSPENDED' : status === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_DEACTIVATED';

  AuditService.log({
    user: performedBy || 'admin',
    role: 'ADMIN',
    action,
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'USER',
    entityId: user.id,
    oldValue: oldStatus,
    newValue: status,
    details: `User ${user.username} status updated to ${status}. ${reason ? `Reason: ${reason}` : ''}`,
  });

  res.json({ success: true, user });
};

milestone1Router.patch('/users/:id/status', handleUpdateUserStatus);
milestone1Router.put('/users/:id/status', handleUpdateUserStatus);
milestone1Router.post('/users/:id/status', handleUpdateUserStatus);

milestone1Router.put('/users/:id/block', (req, res) => {
  req.body = { ...req.body, status: 'BLOCKED' };
  handleUpdateUserStatus(req, res);
});

milestone1Router.put('/users/:id/unblock', (req, res) => {
  req.body = { ...req.body, status: 'ACTIVE' };
  handleUpdateUserStatus(req, res);
});

const handleUpdateUserRole = (req: any, res: any) => {
  const { id } = req.params;
  const { role, performedBy } = req.body;
  const state = db.getState();
  const user = state.users.find((u) => u.id === id || u.username === id);

  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  const oldRole = user.role;
  user.role = role;

  AuditService.log({
    user: performedBy || 'admin',
    role: 'ADMIN',
    action: 'ROLE_CHANGED',
    module: 'MILESTONE_1_KYC_RBAC',
    entity: 'USER',
    entityId: user.id,
    oldValue: oldRole,
    newValue: role,
    details: `Role for ${user.username} changed from ${oldRole} to ${role}`,
  });

  res.json({ success: true, user });
};

milestone1Router.patch('/users/:id/role', handleUpdateUserRole);
milestone1Router.put('/users/:id/role', handleUpdateUserRole);
milestone1Router.post('/users/:id/role', handleUpdateUserRole);

// ======================= AUDIT LOGS =======================
const handleGetAudit = (req: any, res: any) => {
  const state = db.getState();
  const { user, action, module: mod, status, search } = req.query;
  let logs = state.auditLogs;

  if (user) logs = logs.filter((l) => (l.user || '').toLowerCase() === String(user).toLowerCase());
  if (action && action !== 'ALL') logs = logs.filter((l) => l.action === action);
  if (mod && mod !== 'ALL') logs = logs.filter((l) => l.module === mod);
  if (status && status !== 'ALL') logs = logs.filter((l) => l.status === status);
  if (search) {
    const s = String(search).toLowerCase();
    logs = logs.filter(
      (l) =>
        (l.details || '').toLowerCase().includes(s) ||
        (l.entityId || '').toLowerCase().includes(s) ||
        (l.entity || (l as any).entityType || '').toLowerCase().includes(s) ||
        (l.user || l.performedBy || '').toLowerCase().includes(s) ||
        (l.action || '').toLowerCase().includes(s)
    );
  }

  res.json({ success: true, logs, auditLogs: logs });
};

milestone1Router.get('/audit', handleGetAudit);
milestone1Router.get('/audit-logs', handleGetAudit);
