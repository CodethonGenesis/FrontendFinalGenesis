import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import listWeek from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

/*import { VoiceButtonComponent } from './voice-button/voice-button.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';*/
import Swal from 'sweetalert2';
import { SelectModule } from 'primeng/select';
import { EventoDto } from '../../interfaces/Evento';
import { EventService } from '../../services/Event.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { VariablesCompartidasService } from '../../services/variables-compartidas.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    FullCalendarModule,
    //  VoiceButtonComponent,

    NgClass,
    SelectModule,
    FormsModule,
    RouterLink,
    // MatSlideToggleModule,
    // MatSelectModule,
  ],
})
export class CalendarComponent implements OnInit {
  title = 'calendario-fullcalendar';

  // Propiedades para mostrar la información en el modal
  selectedEventTitle: string = '';
  selectedEventStart: string = '';
  selectedId: number = 0;
  isModalVisible: boolean = false;
  eventos: any[] = [];
  eventoSeleccionado?: EventoDto;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  fechaTopeInscripcion: Date = new Date();
  usuarioCompleto: User | null = null;

  constructor(
    public variablesCompartidasService: VariablesCompartidasService,

    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    /* this.obtenerEventos(); */
    const user = this.authService.user;
    this.getUserByUsername(user.user?.username!);
  }

  // Opciones de configuración general
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Vista inicial del calendario
    firstDay: 1, // Lunes como primer día de la semana
    timeZone: 'UTC', // Establecer la zona horaria a UTC
    locale: 'es', // Establecer el idioma a español

    // Configuración de la barra de herramientas
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,multiMonthYear',
    },

    // Configuración de las vistas del calendario

    titleFormat: { month: 'long', year: 'numeric' }, // Formato del título del calendario
    buttonText: {
      today: 'Hoy',
      month: 'Vista mensual',
      multiMonthYear: 'Vista anual',
    },

    // Configuración de eventos
    dayMaxEvents: 3, // Máximo de eventos visibles por día
    events: this.eventos, // Eventos a mostrar en el calendario
    eventOrder: 'duration', // Orden de los eventos
    eventClick: (info) => {
      this.handleEventClick(info);
    },

    // Configuración de selección e interacción
    selectable: true,
    select: (arg) => this.handleDateClick({ startStr: arg.startStr }),
    dateClick: (arg) => this.handleDateClick(arg),

    // Configuración de vistas
    views: {
      multiMonthFourMonth: {
        type: 'multiMonth',
        duration: { months: 2 },
      },
    },

    // Plugins utilizables
    plugins: [
      dayGridPlugin,
      timeGridWeek,
      interactionPlugin,
      listWeek,
      multiMonthPlugin,
    ],
  };

  // Alerta
  handleDateClick(arg: { dateStr: string } | { startStr: string }) {
    const dateStr = 'dateStr' in arg ? arg.dateStr : arg.startStr;
    Swal.fire('Fecha seleccionada: ', dateStr);
  }

  // Manejo de clic en el evento
  handleEventClick(info: any) {
    // Mostrar los detalles del evento en las propiedades de la clase
    this.selectedEventTitle = info.event.extendedProps.name;
    // Guardar el ID del evento seleccionado
    this.selectedId = info.event.id; // Guardar el ID del evento seleccionado
    console.log('id', this.selectedId); // Verificar el ID del evento seleccionado
    this.getEventosById(this.selectedId); // Obtener el evento por ID para mostrar más detalles

    this.selectedEventStart = info.event.fechaInicio;
  }

  // Cerrar el modal
  closeModal() {
    this.isModalVisible = false;
  }

  obtenerEventos() {
    this.eventService.getEventos().subscribe((eventos: any[]) => {
      this.eventos = eventos.map((evento) => ({
        id: evento.id,
        title: evento.name || '',
        descripcion: evento.descripcion,
        start: evento.fInicio ? new Date(evento.fInicio) : new Date(),
        end: evento.fFin ? new Date(evento.fFin) : new Date(),
        estado_id: evento.estado_id,
        estado_nombre: evento.estado_nombre,
        fCreacion: evento.fCreacion,
        fTopeInscripcion: evento.fTopeInscripcion,
        categoria_id: evento.categoria_id,
        nombreCategoria: evento.nombreCategoria,
        coste: evento.coste,
        feed_id: evento.feed_id,
        imagenBase64: evento.imagenBase64 || '',
        limiteUsuarios: evento.limiteUsuarios || 0,
        linkExterno: evento.linkExterno || '',
        ubicacion: evento.ubicacion || '',
        likes: evento.likes || 0,
        dislikes: evento.dislikes || 0,
        codigoVestimenta: evento.codigoVestimenta || '',
        userName: evento.userName || '',
        usuario_id: evento.userId || 0,
        seguidores: evento.seguidores || [],
        usuarios: evento.usuarios || [],
      }));
      console.log(this.eventos); // Verificar los eventos obtenidos
      this.calendarOptions.events = this.eventos; // Actualizar los eventos del calendario
    });
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

  getEventosByUsuarioApuntado() {
    console.log('ID del usuario:', this.usuarioCompleto?.id);
    this.eventService
      .findEventosByUsuarioApuntado(this.usuarioCompleto?.id!)
      .subscribe((eventos: EventoDto[]) => {
        this.eventos = eventos.map((evento) => ({
          id: evento.id,
          title: evento.name || '',
          descripcion: evento.descripcion,
          start: evento.fInicio ? new Date(evento.fInicio) : new Date(),
          end: evento.fFin ? new Date(evento.fFin) : new Date(),
          estado_id: evento.estado_id,
          estado_nombre: evento.estado_nombre,
          fCreacion: evento.fCreacion,
          fTopeInscripcion: evento.fTopeInscripcion,
          categoria_id: evento.categoria_id,
          nombreCategoria: evento.nombreCategoria,
          coste: evento.coste,
          feed_id: evento.feed_id,
          limiteUsuarios: evento.limiteUsuarios || 0,
          linkExterno: evento.linkExterno || '',
          ubicacion: evento.ubicacion || '',
          likes: evento.likes || 0,
          dislikes: evento.dislikes || 0,
          codigoVestimenta: evento.codigoVestimenta || '',
          userName: evento.userName || '',
          usuario_id: evento.usuario_id || 0,
          seguidores: evento.seguidores || [],
          usuarios: evento.usuarios || [],
        }));

        this.calendarOptions.events = this.eventos;
        console.log('nuevos eventos a calendario: ', this.eventos);
      });
  }

  desapuntarse(eventoId: number) {
    this.eventService
      .desapuntarseEvento(eventoId, this.usuarioCompleto!.id!)
      .subscribe({
        next: (response) => {
          console.log('Desapuntado del evento:', response);
          /* this.apuntadoEnEvento = false; */
          this.closeModal();
          window.location.reload();
          this.getEventosByUsuarioApuntado();
        },
        error: (error) => {
          console.error('Error al desapuntarse del evento:', error);
        },
      });
  }

  getEventosById(id: number) {
    this.eventService.getEventoById(id).subscribe((evento: any) => {
      this.eventoSeleccionado = {
        id: evento.id,
        name: evento.name || '',
        descripcion: evento.descripcion,
        fInicio: evento.fInicio,
        fFin: evento.fFin,
        estado_id: evento.estado_id,
        estado_nombre: evento.estado_nombre,
        fCreacion: evento.fCreacion,
        fTopeInscripcion: evento.fTopeInscripcion,
        categoria_id: evento.categoria_id,
        nombreCategoria: evento.nombreCategoria,
        coste: evento.coste,
        feed_id: evento.feed,
        limiteUsuarios: evento.limiteUsuarios || 0,
        linkExterno: evento.linkExterno || '',
        ubicacion: evento.ubicacion || '',
        likes: evento.likes || 0,
        dislikes: evento.dislikes || 0,
        codigoVestimenta: evento.codigoVestimenta || '',
        userName: evento.userName || '',
        usuario_id: evento.userId || 0,
        seguidores: evento.seguidores || [],
        usuarios: evento.usuarios || [],
      };
      this.fechaInicio = new Date(this.eventoSeleccionado.fInicio!);
      console.log('Evento por id', this.eventoSeleccionado); // Verificar el array con la información recibida
      this.isModalVisible = true;
    });
  }
}
