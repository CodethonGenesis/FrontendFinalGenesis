import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-succes-alert',
  standalone: true,
  imports: [],
  template: `
    <div class="success-message" [class.visible]="visible">
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .success-message {
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        background-color: #4caf50;
        color: white;
        padding: 0.5rem 1rem;
        width: fit-content;
        text-wrap: nowrap;
        border-radius: 4px;
        position: fixed;
        top: 100px;
        right: 100px;
        z-index: 1000;
      }

      .success-message.visible {
        display: flex;
        opacity: 1;
      }

      @media (width <= 1024px) {
        .success-message {
          /* top: 50% */
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    `,
  ],
})
export class SuccesAlertComponent {
  @Input() message: string = '';
  visible: boolean = false;

  show() {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}
