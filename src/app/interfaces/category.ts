import { EventoDto } from './Evento';
import { User } from './user';

export interface Category {
  id?: number;
  name: string;
  descripcion: string;
  eventos?: EventoDto[];
  seguidores: User[];
  isFollowedByUser?: boolean;
  eventosCompletos?: EventoDto[];
}
