import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { EventoDto } from '../../interfaces/Evento';
import {
  faArrowLeft,
  faMessage,
  faThumbsUp,
  faThumbsDown,
  faShareFromSquare,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { EventService } from '../../services/Event.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass, NgFor } from '@angular/common';
import { VariablesCompartidasService } from '../../services/variables-compartidas.service';
import { Comentario } from '../../interfaces/comentario';
import { ComentarioService } from '../../services/comentario.service';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-event',
  imports: [FontAwesomeModule, NgClass],
  templateUrl: './Event.component.html',
  styleUrl: './Event.component.css',
})
export default class EventComponent {

  /* variables bandera */
  disliked: boolean = false;
  liked: boolean = false;

  id: number = 0;
  title: string = 'Eventos por categoría || ';
  loading: boolean = false;
  error: string | null = null;
  fechainicio: Date = new Date();
  fechaFin: Date = new Date();
  fechaTopeInscripcion: Date = new Date();
  comentarios: Comentario[] = [];
  usuarioCompleto: User | null = null;
  eventosApuntados: EventoDto[] = [];
  apuntadoEnEvento: boolean = false;
plazasDisponibles: number = 0;
  evento?: EventoDto;

  // Imporaciones de iconos
  faArrow = faArrowLeft;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faMessage = faMessage;
  faShareFromSquare = faShareFromSquare;
  faLocationDot = faLocationDot;
  constructor(
    private route: ActivatedRoute,
    public eventService: EventService,
    private router: Router,
    public variablesCompartidasService: VariablesCompartidasService,
    private comentarioService: ComentarioService,
    private userService: UserService,
    private authService: AuthService
  ) {
    effect(() => {
      this.eventService.setEventoCargado(this.evento || ({} as EventoDto));
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : 0;
      console.log(this.id);
      if (this.id) {
        this.getEventoDtoById(this.id);
        console.log(this.evento);
      }
      const storedUser = sessionStorage.getItem('login');
      console.log('Usuario stored: ', storedUser);
      const user = this.authService.user;
      this.getUserByUsername(user.user?.username!);
    });
  }

  /* Comentarios */
  likeComment() {
    console.log('Like pulsado');
  }

  dislikeComment() {
    console.log('dislikePulsado');
  }

  share() {
    console.log('Compartir');
  }

  getUserByUsername(username: string) {
    this.userService.findByUsername(username).subscribe({
      next: (user) => {
        this.usuarioCompleto = user;
        console.log('Usuario encontrado:', user);
        this.getEventosByUsuarioApuntado();
      },
    });
  }

  apuntarse(eventoId: number) {
    this.eventService
      .apuntarseEvento(eventoId, this.usuarioCompleto!.id!)
      .subscribe({
        next: (response) => {
                Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.message
                });
          this.plazasDisponibles--;
          this.apuntadoEnEvento = true;

          /* this.router.navigate(['/userEvents']); */
        },
        error: (error) => {
          console.error('Error al apuntarse al evento:', error);
        },
      });
  }

  desapuntarse(eventoId: number) {
    this.eventService
      .desapuntarseEvento(eventoId, this.usuarioCompleto!.id!)
      .subscribe({
        next: (response) => {
           Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.message
                });
          this.plazasDisponibles++;
          console.log('Desapuntado del evento:', response);
          this.apuntadoEnEvento = false;
        },
        error: (error) => {
          console.error('Error al desapuntarse del evento:', error);
        },
      });
  }

  getEventosByUsuarioApuntado() {
    console.log('ID del usuario:', this.usuarioCompleto?.id);
    this.eventService
      .findEventosByUsuarioApuntado(this.usuarioCompleto?.id!)
      .subscribe((eventos: EventoDto[]) => {
        this.eventosApuntados = eventos;

        if (
          this.usuarioCompleto?.eventosApuntados
            .map((evento) => evento)
            .includes(this.evento?.id!)
        ) {
          this.apuntadoEnEvento = true;
        } else {
          this.apuntadoEnEvento = false;
        }
      });
  }

  getEventoDtoById(id: number) {
    this.loading = true;
    this.error = null;

    this.eventService.findByDtoId(id).subscribe({
      next: (evento) => {
        this.eventService.setEventoCargado(evento);
        this.evento = this.eventService.getEventoCargado();
        this.fechainicio = new Date(this.evento.fInicio!);
        this.fechaFin = new Date(this.evento.fFin!);
        this.fechaTopeInscripcion = new Date(this.evento.fTopeInscripcion!);
        console.log('Evento:', evento);
        this.getComentariosByFeedId(this.evento.feed_id!);
        console.log('Comentarios:', this.comentarios);
        /* this.getEventsByCategory(id); */
        this.plazasDisponibles = (this.evento?.limiteUsuarios ?? 0) - (this.evento?.usuarios?.length ?? 0);
        console.log('Plazas disponibles:', this.plazasDisponibles);
      },
      error: (err) => {
        this.error = 'Error al cargar la categoría: ' + err.message;
        this.loading = false;
        console.error('Error loading category:', err);
      },
    });
  }

  getComentariosByFeedId(id: number) {
    this.loading = true;
    this.error = null;

    this.comentarioService.getCommentariosByFeedId(id).subscribe({
      next: (comentarios) => {
        this.comentarios = comentarios;
        console.log('Comentarios loaded:', comentarios);
      },
      error: (err) => {
        this.error = 'Error al cargar los comentarios: ' + err.message;
        this.loading = false;
        console.error('Error loading comments:', err);
      },
    });
  }

  /* Like / dislike eventos */
  likeEvent() {
    console.log('likePulsado');

    /* Invertimos el valor de la variable bandera like */
    this.liked = !this.liked;
    console.log('Liked:', this.liked);

    /* Si el like es verdadero, sumamos 1 al like y le restamos 1 al dislike, si lo había */
    if (this.liked) {

      if (this.disliked) {
        this.evento!.dislikes = this.evento!.dislikes ? this.evento!.dislikes - 1 : 0;
        this.disliked = false;

        console.log('Dislike eliminado');
      }

      this.evento!.likes = this.evento!.likes ? this.evento!.likes + 1 : 1;
      console.log('Like sumado');
    }
    else {
      this.evento!.likes = this.evento!.likes ? this.evento!.likes - 1 : 0;

      console.log('Like restado');
    }

    /* Actualizamos el evento */
    this.eventService.updateEvento(this.evento!).subscribe({
      next: (evento) => {
        this.evento = evento;
        console.log('Evento actualizado:', evento);
      },
      error: (err) => {
        this.error = 'Error al actualizar el evento: ' + err.message;
        this.loading = false;
        console.error('Error updating event:', err);
      },
    });
  }

  dislikeEvent() {
    console.log('dislikePulsado');

    /* Invertimos el valor de la variable bandera dislike */
    this.disliked = !this.disliked;
    console.log('Disliked:', this.disliked);

    /* Si el dislike es verdadero, sumamos 1 al dislike y le restamos 1 al like, si lo había */
    if (this.disliked) {

      if (this.liked) {
        this.evento!.likes = this.evento!.likes ? this.evento!.likes - 1 : 0;
        this.liked = false;

        console.log('Like eliminado');
      }

      this.evento!.dislikes = this.evento!.dislikes ? this.evento!.dislikes + 1 : 1;
      console.log('Dislike sumado');
    }
    else {
      this.evento!.dislikes = this.evento!.dislikes ? this.evento!.dislikes - 1 : 0;

      console.log('Dislike restado');
    }

    /* Actualizamos el evento */
    this.eventService.updateEvento(this.evento!).subscribe({
      next: (evento) => {
        this.evento = evento;
        console.log('Evento actualizado:', evento);
      },
      error: (err) => {
        this.error = 'Error al actualizar el evento: ' + err.message;
        this.loading = false;
        console.error('Error updating event:', err);
      },
    });
  }
}
