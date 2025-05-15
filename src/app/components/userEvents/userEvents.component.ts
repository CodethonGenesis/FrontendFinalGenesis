import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { VariablesCompartidasService } from '../../services/variables-compartidas.service';

@Component({
  selector: 'app-user-events',
  imports: [NgClass, RouterOutlet, RouterLink],
  templateUrl: './userEvents.component.html',
  styleUrl: './userEvents.component.css',
})
export default class UserEventsComponent implements OnInit {
  favoritos = true;
  modalActivo = false;

  constructor(public variablesCompartidas: VariablesCompartidasService) {
    effect(() => {
      this.modalActivo = this.variablesCompartidas.modalCrearEventoActivo();
      console.log(
        'valor del effect : ',
        this.variablesCompartidas.modalCrearEventoActivo()
      );
      console.log('valor del effect aaa : ', this.modalActivo);
    });
  }
  ngOnInit(): void {
    console.log(
      'valor del effect : ',
      this.variablesCompartidas.modalCrearEventoActivo()
    );
  }
}
