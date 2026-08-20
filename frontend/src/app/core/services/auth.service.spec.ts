import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { Role, LoginResponse } from '../models/auth.models';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageUtil } from '../utils/storage.util';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    StorageUtil.removeItem(STORAGE_KEYS.AUTH_SESSION);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', redirectTo: '' }])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    StorageUtil.removeItem(STORAGE_KEYS.AUTH_SESSION);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should issue POST to login API and set session', () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-test-token',
      user: {
        id: 'u-1',
        username: 'admin',
        fullName: 'Admin User',
        role: Role.ADMIN
      }
    };

    service.login({ username: 'admin', password: 'password' }).subscribe(() => {
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getCurrentUser()?.username).toBe('admin');
      expect(service.getCurrentRole()).toBe(Role.ADMIN);
    });

    const req = httpMock.expectOne(req => req.url.includes(API_ENDPOINTS.AUTH.LOGIN));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear session on logout', () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-test-token',
      user: { id: 'u-1', username: 'admin', fullName: 'Admin User', role: Role.ADMIN }
    };
    (service as any).setSession(mockResponse);
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    const req = httpMock.expectOne(req => req.url.includes(API_ENDPOINTS.AUTH.LOGOUT));
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should check permissions correctly for ADMIN role', () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-test-token',
      user: { id: 'u-1', username: 'admin', fullName: 'Admin User', role: Role.ADMIN }
    };
    (service as any).setSession(mockResponse);

    expect(service.hasPermission('any:permission')).toBe(true);
  });

  it('should check permissions correctly for CUSTOMER role', () => {
    const mockResponse: LoginResponse = {
      token: 'jwt-test-token',
      user: { id: 'u-3', username: 'customer', fullName: 'Customer User', role: Role.CUSTOMER }
    };
    (service as any).setSession(mockResponse);

    expect(service.hasPermission('view:dashboard')).toBe(true);
    expect(service.hasPermission('edit:customers')).toBe(false);
  });
});
