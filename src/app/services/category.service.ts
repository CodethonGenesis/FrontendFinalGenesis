import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../interfaces/category';
import { environment } from '../enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly url: string = `${environment.BACK_URL}/api/categorias`;

  constructor(private http: HttpClient) {}

  categorias = signal<Category[]>([]);
  categoriaCargada = signal<Category>({} as Category);

  getCategorias() {
    return this.categorias();
  }

  setCategorias(categorias: Category[]) {
    this.categorias.set(categorias);
  }

  getCategoriaCargada() {
    return this.categoriaCargada();
  }

  setCategoriaCargada(categoria: Category) {
    this.categoriaCargada.set(categoria);
  }

  // Obtener todas las categorías
  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
    /*       .pipe(catchError(this.handleError)); */
  }

  findById(id: number): Observable<Category> {
    return this.http
      .get<Category>(`${this.url}/dto/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear nueva categoría (id autoincrementable)
  create(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.url, category, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.handleError));
  }

  // Eliminar categoría
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar categoría
  update(category: Category, id: number): Observable<Category> {
    return this.http
      .put<Category>(`${this.url}/${id}`, category, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError(this.handleError));
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
