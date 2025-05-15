import { Injectable, signal } from '@angular/core';
import { environment } from '../enviroment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Comentario } from '../interfaces/comentario';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private readonly url: string = `${environment.BACK_URL}/api/comentarios`;
  private readonly urlDto: string = `${environment.BACK_URL}/api/comentarios`;

  constructor(private http: HttpClient) {}

  comentarios = signal<Comentario[]>([]);

  getCommentariosByFeedId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/feed/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        error.error?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
