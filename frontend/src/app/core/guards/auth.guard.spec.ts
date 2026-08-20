import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { vi } from 'vitest';

describe('authGuard', () => {
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  it('should allow access when user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/customer' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
    expect(result).toBe(true);
  });

  it('should redirect unauthenticated users to /login with returnUrl query parameter', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/customer/123' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toContain('/login?returnUrl=%2Fcustomer%2F123');
  });
});
