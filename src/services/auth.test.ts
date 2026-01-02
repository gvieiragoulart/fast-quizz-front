import { describe, it, expect } from 'vitest';
import { authService } from '../services/auth';

describe('authService', () => {
  it('should store token on login', () => {
    const mockToken = 'test-token-123';
    localStorage.setItem('authToken', mockToken);
    
    expect(authService.getToken()).toBe(mockToken);
    expect(authService.isAuthenticated()).toBe(true);
    
    localStorage.removeItem('authToken');
  });

  it('should remove token on logout', () => {
    localStorage.setItem('authToken', 'test-token');
    authService.logout();
    
    expect(authService.getToken()).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('should return false for isAuthenticated when no token', () => {
    localStorage.removeItem('authToken');
    expect(authService.isAuthenticated()).toBe(false);
  });
});
