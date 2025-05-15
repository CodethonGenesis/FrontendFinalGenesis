import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { AsideComponent } from '../common/aside/aside.component';
import { VariablesCompartidasService } from '../../services/variables-compartidas.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule,  RouterOutlet, AsideComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  username: string = '';
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    effect(() => {
      this.changeBackground();
    });
  }
  public variablesCompartidas = inject(VariablesCompartidasService);

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.user;
    this.username = user.user?.username || 'User';
    this.isAdmin = user.isAdmin;
    this.changeBackground();
  }

  changeBackground() {
    if (this.variablesCompartidas.tema() == '') {
      document.getElementById('content')!.style.backgroundImage =
        'url("/bg-prueba2.jpeg")';
      console.log('tema: ', this.variablesCompartidas.tema());
    } else if (this.variablesCompartidas.tema() === 'light') {
      document.getElementById('content')!.style.backgroundImage =
        'url("/bg-prueba2.jpeg")';
      console.log('tema: ', this.variablesCompartidas.tema());
    } else {
      document.getElementById('content')!.style.backgroundImage =
        'url("/bg-prueba.jpg")';
      console.log('tema: ', this.variablesCompartidas.tema());
    }
  }
}
