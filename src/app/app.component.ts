import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FontAwesomeModule],
  template: `<router-outlet></router-outlet>`,
  styles: [
    `
      .container {
        width: 100%;
        height: 100%;
      }
      app-header {
        width: 100%;
        max-width: 1440px;
        position: fixed;
        margin: 1rem auto;
        left: 50%;
        transform: translate(-50%);
        z-index: 5;
      }
      app-footer {
        width: 100%;
        background-color: #202020;
      }

      header {
        position: relative;
        margin: 0 auto;
        width: 100%;
        z-index: 5;
      }
    `,
  ],
})
export class AppComponent {
  title = 'your-app-name';
}
