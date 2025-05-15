import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // DEVELOPMENT MODE: Always allow access
  console.log('Auth guard bypassed for development');
  return true;

  /* PRODUCTION CODE - Uncomment when ready
  try {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      router.navigate(['/login']);
      return false;
    }

    // Check token expiration
    if (isTokenExpired(authService)) {
      console.log('Token expired, logging out user');
      authService.logout();
      router.navigate(['/login']);
      return false;
    }

    // Check admin status
    if (!authService.isAdmin()) {
      console.log('User is not admin, redirecting to forbidden');
      router.navigate(['/forbidden']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in auth guard:', error);
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
  */
};

const isTokenExpired = (authService: AuthService): boolean => {
  try {
    const token = authService.token;

    // Check if token exists
    if (!token) {
      console.log('No token found');
      return true;
    }

    const payload = authService.getPayload(token) as TokenPayload | null;

    // Check if payload exists and has expiration
    if (!payload || !payload.exp) {
      console.log('Invalid token payload');
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    // Log warning if token is close to expiring (e.g., less than 5 minutes)
    if (timeUntilExpiry < 300) {
      console.warn(`Token will expire in ${timeUntilExpiry} seconds`);
    }

    return currentTime > payload.exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Optional: Add a refresh token mechanism
const refreshToken = async (authService: AuthService): Promise<boolean> => {
  try {
    // Implement your token refresh logic here
    // For example:
    // await authService.refreshToken();
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};
