import { Category } from './category';
import { EventoDto } from './Evento';

export class User {
  username!: string;
  password!: string;
  email?: string;
  name?: string;
  lastname?: string;
  id: number = 0;
  categorias?: Category[];
  roles: number[] = [];
  eventosApuntados: number[] = [];
}
