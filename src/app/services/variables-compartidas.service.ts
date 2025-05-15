import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class VariablesCompartidasService {
  constructor() {}

  inputContent = signal<string>('');
  tema = signal<string>('');
  modalCrearEventoActivo = signal<boolean>(false);
  userAdmin = signal<boolean>(false);
  usuarioCompleto = signal<User | null>(null);

  formatDate(fecha?: Date): string {
    if (!fecha) return '';
    const opcionesDia: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
    };
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    let dia = new Intl.DateTimeFormat('es-ES', opcionesDia).format(fecha);
    dia = dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();

    const fechaLarga = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(
      fecha
    );
    const hora = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);

    return `${dia}, ${fechaLarga} a las ${hora}`;
  }

  formatDateOnly(fecha?: Date): string {
    if (!fecha) return '';
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    // El formato por defecto en 'es-ES' es dd/mm/yyyy, así que lo convertimos a yyyy-mm-dd
    const [day, month, year] = new Intl.DateTimeFormat('es-ES', opcionesFecha)
      .format(fecha)
      .split('/');
    return `${year}-${month}-${day}`;
  }
}
