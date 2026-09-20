import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';
import { vi } from 'vitest';

describe('roleGuard', () => {
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn>; getCurrentRole: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      getCurrentRole: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  it('should redirect unauthenticated users to /login', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    const dummyRoute = { data: { roles: [Role.ADMIN] } } as unknown as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('should allow access when user has expected role', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getCurrentRole.mockReturnValue(Role.ADMIN);
    const dummyRoute = { data: { roles: [Role.ADMIN, Role.EMPLOYEE] } } as unknown as ActivatedRouteSnapshot;
    const dummyState = { url: '/customer/new' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(dummyRoute, dummyState));
    expect(result).toBe(true);
  });

  it('should redirect to /403 when user lacks expected role', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getCurrentRole.mockReturnValue(Role.CUSTOMER);
    const dummyRoute = { data: { roles: [Role.ADMIN] } } as unknown as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin/roles' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/403');
  });
});
