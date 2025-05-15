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

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url: string = `${environment.BACK_URL}/api/users`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(catchError(this.handleError));
  }

  findAllPageable(
    page: number,
    size: number = 10
  ): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<PageResponse<User>>(`${this.url}/page`, { params })
      .pipe(catchError(this.handleError));
  }

  findByUsername(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.url}/usersByName/${username}`)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(user: User): Observable<User> {
    return this.http
      .post<User>(this.url, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }

  register(user: any) {
    return this.http
      .post(this.url, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }

  update(user: User): Observable<User> {
    if (!user.id) {
      return throwError(() => new Error('User ID is required for update'));
    }
    return this.http
      .put<User>(`${this.url}/${user.id}`, user)
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

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
}
