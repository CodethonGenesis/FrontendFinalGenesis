import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { EventService } from '../../services/Event.service';
import { Category } from '../../interfaces/category';
import { EventoDto } from '../../interfaces/Evento';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css',
})
export default class SectionComponent implements OnInit {
  id: number = 0;
  title: string = 'Eventos por categoría || ';
  loading: boolean = false;
  error: string | null = null;

  category?: Category;
  eventos: EventoDto[] = [];

  faArrow = faArrowLeft;

  constructor(
    private route: ActivatedRoute,
    public categoryService: CategoryService,
    private eventService: EventService,
    private router: Router
  ) {
    effect(() => {
      this.categoryService.setCategoriaCargada(
        this.category || ({} as Category)
      );
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : 0;
      console.log(this.id);
      if (this.id) {
        this.getCategoryById(this.id);
        console.log(this.category);
        this.getEventosByCategory(this.id);
        console.log(this.eventos);
      }
    });
  }

  getCategoryById(id: number) {
    this.loading = true;
    this.error = null;

    this.categoryService.findById(id).subscribe({
      next: (category) => {
        this.categoryService.setCategoriaCargada(category);
        this.category = this.categoryService.getCategoriaCargada();
        console.log('Category loaded:', category);
        /* this.getEventsByCategory(id); */
      },
      error: (err) => {
        this.error = 'Error al cargar la categoría: ' + err.message;
        this.loading = false;
        console.error('Error loading category:', err);
      },
    });
  }

  getEventosByCategory(id: number) {
    this.loading = true;
    this.error = null;

    this.eventService.findEventosByCategoria(id).subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        console.log('Eventos loaded:', eventos);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos: ' + err.message;
        this.loading = false;
        console.error('Error loading eventos:', err);
      },
    });
  }
}
