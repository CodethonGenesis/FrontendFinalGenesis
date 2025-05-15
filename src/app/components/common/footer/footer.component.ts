import { Component, effect, inject } from '@angular/core';
import { VariablesCompartidasService } from '../../../services/variables-compartidas.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  public inputValue = inject(VariablesCompartidasService);

  constructor() {
    effect(() => {});
  }
}
