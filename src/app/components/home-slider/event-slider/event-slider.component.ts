import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { EventService } from '../../../services/Event.service';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-event-slider',
  standalone: true,
  imports: [NgFor,NgClass, RouterLink],
  templateUrl: './event-slider.component.html',
  styleUrls: ['./event-slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer?: ElementRef;

  eventos: any[] = [];
  swiperInitialized = false;

  // Swiper configuration
  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 }
    }
  };

  constructor(private event: EventService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getEventos();
  }

  ngAfterViewInit() {
    if (this.eventos.length > 0) {
      this.initSwiper();
    }
  }

  private initSwiper() {
    if (this.swiperContainer && !this.swiperInitialized) {
      setTimeout(() => {
        Object.assign(this.swiperContainer?.nativeElement, this.swiperConfig);
        this.swiperContainer?.nativeElement.initialize();
        this.swiperInitialized = true;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  getEventos() {
    this.event.getEventos().subscribe(
      (eventos) => {
        this.eventos = eventos;
        console.log('Eventos cargados:', this.eventos);

        // Inicializar Swiper después de cargar los datos
        if (this.eventos.length > 0) {
          this.initSwiper();
        }
      },
      (error) => {
        console.error('Error al cargar eventos:', error);
      }
    );
  }

  trackEvento(index: number, evento: any): number {
    return evento.id; // Asegúrate de que cada evento tiene un id único
  }


}