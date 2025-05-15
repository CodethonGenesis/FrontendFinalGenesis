import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { environment } from '../enviroment/environment';
@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  private readonly url: string = `${environment.BACK_URL}/api/users`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage =
        error.error?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Falta hacer endpoint en el backend
  findByEmail(email: string): Observable<User> {
    return this.http
      .get<User>(`${this.url}/email/${email}`)
      .pipe(catchError(this.handleError));
  }

  findByUserName(name: string): Observable<User> {
    return this.http
      .get<User>(`${this.url}/usersByName/${name}`)
      .pipe(catchError(this.handleError));
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/email-exists/${email}`).pipe(
      catchError(this.handleError)
    );
  }

  sendEmail(email: string): Observable<string> {
    const body = { email };
    console.log(
      `Sending email to: ${email} using URL: ${environment.BACK_URL}/auth/send-code/${email}`
    );
    return this.http
      .post(`${environment.BACK_URL}/auth/send-code`, body, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  verifyCode(
    email: string,
    code: string
  ): Observable<{ success: boolean; message: string }> {
    const body = { email, code };
    return this.http
      .post<{ success: boolean; message: string }>(
        `${environment.BACK_URL}/auth/verify-code`,
        body
      )
      .pipe(catchError(this.handleError));
  }

  resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Observable<string> {
    const body = { email, code, newPassword };
    return this.http
      .post(`${environment.BACK_URL}/auth/reset-password-with-code`, body, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }
}
