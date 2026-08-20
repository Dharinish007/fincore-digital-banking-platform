import { Role } from '../models/auth.models';

export class RoleUtil {
  static hasAnyRole(currentRole: Role | null, expectedRoles: Role[]): boolean {
    if (!currentRole) return false;
    if (!expectedRoles || expectedRoles.length === 0) return true;
    return expectedRoles.includes(currentRole);
  }

  static isAdmin(currentRole: Role | null): boolean {
    return currentRole === Role.ADMIN;
  }
}
