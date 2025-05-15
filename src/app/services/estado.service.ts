import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/environment';
import { Estado } from '../interfaces/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private readonly url: string = `${environment.BACK_URL}/api/estados`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.url);
  }

  findById(id: number): Observable<Estado> {
    return this.http.get<Estado>(`${this.url}/${id}`);
  }
}
