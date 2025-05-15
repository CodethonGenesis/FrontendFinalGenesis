import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  Renderer2,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/Event.service';
import { EventoDto } from '../../interfaces/Evento';
import { EventSliderComponent } from "../home-slider/event-slider/event-slider.component";
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [RouterLink, EventSliderComponent, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class HomeComponent implements OnInit {
  activeIndex: number = -1;

  @ViewChildren('categoryItem') categoryItems!: QueryList<ElementRef>;

  // Imágenes para categorías
  categoryImages = [
    '/social.png',
    '/medio-ambiente.png',
    '/ocio.png',
    '/deporte.png',
    '/musica.png',
  ];

  // Íconos para categorías
  categoryIcons = [
    'fas fa-hiking',
    'fas fa-sun',
    'fas fa-mountain',
    'fas fa-leaf',
    'fas fa-globe',
  ];

  constructor(
    public categoryService: CategoryService,
    private eventService: EventService
  ) {
    effect(() => {
      this.categories = this.categoryService.categorias();
      console.log('valor del effect : ', this.categoryService.categorias());
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  categories: Category[] = [];
  eventos: EventoDto[] = [];

  getCategories() {
    this.categoryService.findAll().subscribe((categories) => {
      this.categories = categories; // guarda las categorías
      this.categoryService.setCategorias(categories);

      // Recorre cada categoría y le agrega sus eventos
      this.categories.forEach((category) => {
        this.eventService
          .findEventosByCategoria(category.id!)
          .subscribe((events) => {
            category.eventosCompletos = events; // Agrega los eventos directamente a la categoría
            console.log(`Eventos de la categoría ${category.name}:`, events);
          });
      });
      console.log('Categorías:', this.categories);
    });
  }

  setActive(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = -1;
    } else {
      this.activeIndex = index;
    }
  }

  getCategoryImage(index: number): string {
    const imgIndex = index % this.categoryImages.length;
    return this.categoryImages[imgIndex];
  }

  getCategoryIcon(index: number): string {
    const iconIndex = index % this.categoryIcons.length;
    return this.categoryIcons[iconIndex];
  }
}
