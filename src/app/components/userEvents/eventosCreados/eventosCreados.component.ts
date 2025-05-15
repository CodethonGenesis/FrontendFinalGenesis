import { Component, effect, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventService } from '../../../services/Event.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Estado } from '../../../interfaces/Estado';
import { EstadoService } from '../../../services/estado.service';
import { EventoDto } from '../../../interfaces/Evento';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { VariablesCompartidasService } from '../../../services/variables-compartidas.service';

@Component({
  selector: 'app-eventos-creados',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    FontAwesomeModule,
    RouterLink,
    NgIf,
    NgFor,
  ],
  templateUrl: './eventosCreados.component.html',
  styleUrl: './eventosCreados.component.css',
})
export default class EventosCreadosComponent implements OnInit {
  nuevoEvento = false;
  eventoForm: FormGroup;
  errores: string[] = [];
  categorias: Category[] = [];
  estados: Estado[] = [];
  selectedFile?: File;
  user: User | null = null;
  username: string = '';

  faXmark = faXmark;
  eventosDeUsuario: EventoDto[] = [];

  constructor(
    private fb: FormBuilder,
    private eventoService: EventService,
    private categoriaService: CategoryService,
    private estadoService: EstadoService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public variablesCompartidas: VariablesCompartidasService
  ) {
    this.eventoForm = this.fb.group({
      name: ['', Validators.required],
      descripcion: [''],
      fInicio: [null, Validators.required],
      fFin: [null],
      fTopeInscripcion: [null],
      categoria_id: [null, Validators.required],
      codigoVestimenta: [''],
      coste: [0],
      limiteUsuarios: [null],
      linkExterno: [''],
      ubicacion: [''],
    });

    effect(() => {
      this.variablesCompartidas.modalCrearEventoActivo.set(this.nuevoEvento);
    });
  }

  ngOnInit(): void {
    this.getAllCategorias();
    const storedUser = sessionStorage.getItem('login');
    console.log('Usuario: ', storedUser);
    const user = this.authService.user;
    this.username = user.user?.username || 'User';
    this.findByUsername();
  }
  /*
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file instanceof File) {
      this.selectedFile = file;
    } else {
      this.selectedFile = undefined;
    }
  } */

  onSubmit() {
    if (this.eventoForm.invalid) {
      this.errores = ['Por favor complete los campos requeridos'];
      return;
    }

    this.estadoService.findById(1).subscribe({
      next: (estadoPendiente: Estado) => {
        const formValue = this.eventoForm.value;
        // Convert dates to ISO strings
        const fInicio = formValue.fInicio
          ? new Date(formValue.fInicio).toISOString()
          : null;
        const fFin = formValue.fFin
          ? new Date(formValue.fFin).toISOString()
          : null;
        const fTopeInscripcion = formValue.fTopeInscripcion
          ? new Date(formValue.fTopeInscripcion).toISOString()
          : null;
        console.log('id categoria del evento', formValue.categoria_id);
        const evento: EventoDto = {
          // id: 0, // Uncomment if backend expects id on creation
          name: formValue.name,
          descripcion: formValue.descripcion,
          estado_id: 1,
          fInicio: fInicio,
          fFin: fFin,
          fTopeInscripcion: fTopeInscripcion,
          categoria_id: Number(formValue.categoria_id),
          usuario_id: this.user!.id,
          codigoVestimenta: formValue.codigoVestimenta,
          coste: Number(formValue.coste),
          limiteUsuarios: formValue.limiteUsuarios
            ? Number(formValue.limiteUsuarios)
            : undefined,
          linkExterno: formValue.linkExterno,
          ubicacion: formValue.ubicacion,
        };

        this.eventoService.crearEvento(evento).subscribe({
          next: (response: EventoDto) => {
            console.log('Evento creado:', response);
            this.nuevoEvento = false;
            this.variablesCompartidas.modalCrearEventoActivo.set(
              this.nuevoEvento
            );
            this.eventoForm.reset();
            this.findEventsByUserId();
          },
          error: (error: any) => {
            console.error('Error al crear evento:', error);
            this.errores = [
              'Error al crear el evento. Por favor intente de nuevo.',
            ];
          },
        });
      },
      error: (error: any) => {
        console.error('Error al obtener estado pendiente:', error);
        this.errores = [
          'Error al crear el evento. Por favor intente de nuevo.',
        ];
      },
    });
  }

  findByUsername() {
    this.userService.findByUsername(this.username).subscribe((user) => {
      console.log(user);
      this.user = user;
      console.log('Usuario método:', this.user);
      this.findEventsByUserId();
    });
  }

  findEventsByUserId() {
    this.eventoService.getEventosByUserId(this.user!.id).subscribe((events) => {
      console.log(events);
      this.eventosDeUsuario = events;
      console.log('Eventos de usuario:', this.eventosDeUsuario);
    });
  }

  getAllCategorias() {
    this.categoriaService.findAll().subscribe({
      next: (response) => {
        this.categorias = response;
        console.log('Categorías obtenidas:', this.categorias);
      },
      error: (error) => {
        console.error('Error al obtener las categorías:', error);
      },
    });
  }
}
