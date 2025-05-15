import { Category } from './category';
import { Estado } from './Estado';
import { User } from './user';

export interface EventoDto {
  id?: number;
  name?: string;
  descripcion?: string;
  estado?: Estado;
  fCreacion?: Date;
  fInicio: string | null;
  fFin: string | null;
  fTopeInscripcion: string | null;
  categoria_id: number;
  nombreCategoria?: string;
  categoria?: Category;
  feed?: string;
  usuarios?: any[];
  seguidores?: any[];
  limiteUsuarios?: number;
  linkExterno?: string;
  ubicacion?: string;
  coste?: number;
  likes?: number;
  dislikes?: number;
  codigoVestimenta?: string;
  idUsuario?: number;
  userName?: string;
  usuario?: User;
  usuario_id?: number;
  estado_id?: number;
  estado_nombre?: string;
  feed_id?: number;
}

export interface Comment {
  id: number;
  eventoId: number;
  eventoName: string;
  autor_email: string;
  autor_id: number;
  autor_username: string;
  contenido: string;
  fecha: string;
  dislikes: number;
  feed_id: number;
  likes: number;
}
