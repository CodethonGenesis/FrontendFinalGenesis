import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../enviroment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../interfaces/category';
import { EventoDto } from '../interfaces/Evento';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly url: string = `${environment.BACK_URL}/api/eventos`;
  private readonly urlDto: string = `${environment.BACK_URL}/api/eventos`;

  constructor(private http: HttpClient) {}

  eventos = signal<EventoDto[]>([]);
  eventoCargado = signal<EventoDto>({} as EventoDto);

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`);
  }

  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/id/${id}`);
  }

  crearEvento(evento: EventoDto): Observable<EventoDto> {
    if (!evento.name || !evento.fInicio || !evento.categoria_id) {
      throw new Error(
        'Los campos nombre, fecha de inicio y categoría son requeridos'
      );
    }

    // Asegurarte de convertir las fechas a string ISO si es necesario
    const eventoJson = {
      ...evento,
      fInicio: evento.fInicio,
      fFin: evento.fFin,
      fTopeInscripcion: evento.fTopeInscripcion,
      estadoId: evento.estado?.id || 1,
    };

    return this.http.post<EventoDto>(`${this.url}/with-dto`, eventoJson);
  }

  updateEvento(evento: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${evento.id}`, evento);
  }

  getEventosByUserId(id: number): Observable<EventoDto[]> {
    return this.http.get<EventoDto[]>(
      `${this.url}/usuario/${id}` // Cambia 'usuario' por el endpoint correcto
    );
  }

  updateEventoMenu(evento: EventoDto): Observable<EventoDto> {
    if (!evento.id) {
      throw new Error('El ID del evento es requerido para la actualización');
    }

    const eventoJson = {
      ...evento,
      fInicio: evento.fInicio,
      fFin: evento.fFin,
      fTopeInscripcion: evento.fTopeInscripcion,
      estadoId: evento.estado?.id || 1,
    };

    return this.http.put<EventoDto>(`${this.url}/${evento.id}`, eventoJson);
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  getEventoCargado(): EventoDto {
    return this.eventoCargado();
  }
  setEventoCargado(evento: EventoDto): void {
    this.eventoCargado.set(evento);
  }

  getEventosDto(): EventoDto[] {
    return this.eventos();
  }

  setEventosDto(eventos: EventoDto[]): void {
    this.eventos.set(eventos);
  }

  eventosFiltrados = signal<EventoDto[]>([]);

  filtrarEventos(searchTerm: string): void {
    const filteredEventos = this.eventos().filter((evento: EventoDto) => {
      return (
        evento.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.nombreCategoria?.includes(searchTerm) ||
        evento.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    this.eventosFiltrados.set(filteredEventos);
  }

  findAll(): Observable<EventoDto[]> {
    return this.http
      .get<EventoDto[]>(this.urlDto)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<EventoDto> {
    return this.http
      .get<EventoDto>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  findByDtoId(id: number): Observable<EventoDto> {
    return this.http
      .get<EventoDto>(`${this.url}/id/${id}`)
      .pipe(catchError(this.handleError));
  }

  findAllEventosDto(): Observable<EventoDto[]> {
    return this.http
      .get<EventoDto[]>(this.urlDto)
      .pipe(catchError(this.handleError));
  }

  findEventosByCategoria(categoriaId: number): Observable<EventoDto[]> {
    return this.http
      .get<EventoDto[]>(`${this.url}/categoria/${categoriaId}`)
      .pipe(catchError(this.handleError));
  }

  findEventosByUsuarioApuntado(ususarioId: number): Observable<EventoDto[]> {
    return this.http
      .get<EventoDto[]>(`${this.url}/apuntado/${ususarioId}`)
      .pipe(catchError(this.handleError));
  }

  apuntarseEvento(EventoId: number, usuarioId: number): Observable<any> {
    return this.http
      .post<any>(`${this.url}/${EventoId}/apuntarse/${usuarioId}`, {})
      .pipe(catchError(this.handleError));
  }

  desapuntarseEvento(EventoId: number, usuarioId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.url}/${EventoId}/desapuntarse/${usuarioId}`, {})
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
