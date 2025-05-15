import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../enviroment/environment';
import {
  LoginCredentials,
  LoginResponse,
  TokenPayload,
  UserAuth,
} from '../interfaces/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url: string = `${environment.BACK_URL}/login`;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'login';

  private _token: string | null = null;
  private _user: UserAuth = {
    isAuth: false,
    isAdmin: false,
    user: undefined,
  };

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  loginUser(credentials: LoginCredentials): Observable<LoginResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post<LoginResponse>(this.url, credentials, { headers })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.token = response.token;
            const payload = this.getPayload(response.token);
            if (payload) {
              this.user = {
                user: { username: payload.sub },
                isAuth: true,
                isAdmin: payload.isAdmin,
              };
            }
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(
            () =>
              new Error(
                error.error?.message || 'An error occurred during login'
              )
          );
        })
      );
  }

  private initializeFromStorage(): void {
    const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
    const storedUser = sessionStorage.getItem(this.USER_KEY);

    if (storedToken) {
      this._token = storedToken;
    }

    if (storedUser) {
      try {
        this._user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        this.logout();
      }
    }
  }

  set user(user: UserAuth) {
    this._user = user;
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  get user(): UserAuth {
    return this._user;
  }

  set token(token: string) {
    this._token = token;
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  get token(): string | null {
    return this._token;
  }

  getPayload(token: string): TokenPayload | null {
    try {
      const payload = token.split('.')[1];
      return payload ? JSON.parse(atob(payload)) : null;
    } catch (e) {
      console.error('Error parsing token payload:', e);
      return null;
    }
  }

  isAdmin(): boolean {
    return this._user.isAdmin;
  }

  isAuthenticated(): boolean {
    return this._user.isAuth;
  }

  logout(): void {
    this._token = null;
    this._user = {
      isAuth: false,
      isAdmin: false,
      user: undefined,
    };
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.http
        .post<LoginResponse>(`${this.url}/refresh-token`, {
          refreshToken: this.refreshToken,
        })
        .toPromise();

      if (response?.token) {
        this.token = response.token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
}
