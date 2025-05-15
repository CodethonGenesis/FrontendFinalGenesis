import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { VariablesCompartidasService } from '../../services/variables-compartidas.service';
import { EventoDto } from '../../interfaces/Evento';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/Event.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-event-search',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './eventSearch.component.html',
  styleUrl: './eventSearch.component.css',
})
export default class EventSearchComponent implements OnInit {
  public variablesCompartidas = inject(VariablesCompartidasService);

  public eventoService = inject(EventService);

  eventosDto: EventoDto[] = [];
  eventosFiltrados: EventoDto[] = [];

  constructor() {
    effect(() => {
      this.eventoService.setEventosDto(this.eventosDto);
      this.eventoService.filtrarEventos(
        this.variablesCompartidas.inputContent()
      );
    });
  }

  ngOnInit(): void {
    this.findAllEventosDto();
  }

  findAllEventosDto() {
    this.eventoService.findAllEventosDto().subscribe((eventos) => {
      this.eventoService.setEventosDto(eventos);
      this.eventosDto = eventos;
    });
  }
}
