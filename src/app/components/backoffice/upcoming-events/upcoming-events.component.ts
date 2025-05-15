import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { EventoDto } from '../../../interfaces/Evento';
import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/Event.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-events',
  imports: [CommonModule, NgIf, NgFor, RouterLink],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css',
})
export class UpcomingEventsComponent {
  showMode: string = 'all'; // 'all', 'category', 'approved', 'denied'
  showFilter: boolean = false;

  events: EventoDto[] = [];

  eventsByCategory: { category: string; eventos: EventoDto[] }[] = [];

  // Constructor de la clase
  constructor(
    private categoryService: CategoryService,
    private eventService: EventService
  ) {}

  // Carga todas los eventos al iniciar el componente
  ngOnInit(): void {
    this.findEvents();
    this.filterEventsByCategory();
  }

  // No funciona
  findEvents() {
    this.eventService.findAllEventosDto().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error(err),
      complete: () => {
        console.log('Eventos cargados:', this.events);
      },
    });
  }

  // Filtra los eventos por categoría
  filterEventsByCategory() {
    /* this.events.forEach((evento) => {

      const category = this.eventsByCategory.find((cat) => cat.category === evento.nombreCategoria);

      if (category) {
        category.eventos.push(evento);
      } else {
        this.eventsByCategory.push({
          category: evento.nombreCategoria,
          eventos: [evento],
        });
      }
    }); */
  }

  // Elige cómo se muestran los eventos (todos, agrupados por categoría, etc.)
  setFilterMode(mode: string) {
    this.showMode = mode;
  }

  // Muestra u oculta el filtro
  openFilter() {
    this.showFilter = !this.showFilter;
  }

  // Aprobar un evento pendiente
  aprobarEvento(evento: EventoDto) {
    // Implementar la lógica para aprobar el evento
    console.log('Evento aprobado:', evento);
  }

  // Denegar un evento
  denegarEvento(evento: EventoDto) {
    // Implementar la lógica para rechazar el evento
    console.log('Evento denegado:', evento);
  }
}
