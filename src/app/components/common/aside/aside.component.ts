import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faHome,
  faUser,
  faHeart,
  faBookmark,
  faCog,
  faList,
  faMoon,
  faSun,
  faBroom,
  faSignOutAlt,
  faXmark,
  faCalendarDays,
  faThLarge,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { VariablesCompartidasService } from '../../../services/variables-compartidas.service';
import { UserI } from '../../../interfaces/userI';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, CommonModule],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit, OnDestroy {
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isDarkTheme = false; // Estado inicial del tema
  themeSwitchValue = 'dracula';

  text: string = '';
  rol: any[] = [];
  sidebarOpen = false;

  /* ngOnInit(): void {
    const user = this.authService.user;
    this.username = user.user?.username || 'User';
    console.log('user', user);
  }*/

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {
    effect(() => {
      this.text = this.variablesCompartidas.inputContent();
      console.log('valor del effect : ', this.text);
      this.getUser();
    });
  }

  ngOnInit(): void {
    const user = this.authService.user;
    this.username = user.user?.username || 'User';

    console.log('user', user);
    this.getUser();

    // Detectar si es móvil para cerrar el sidebar inicialmente
    this.checkMobileView();

    // Añadir listener para el resize de la ventana
    window.addEventListener('resize', this.checkMobileView.bind(this));

    // Forzar la detección de cambios para asegurar que los iconos se muestren
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  getUser() {
    this.userService.findByUsername(this.username).subscribe({
      next: (data) => {
        this.variablesCompartidas.usuarioCompleto.set(data);
        this.rol = data.roles;
        if (this.rol[0] === 1) {
          this.variablesCompartidas.userAdmin.set(true);
        }
        console.log('Usuario:', data);
        console.log('Rol:', this.rol);
        console.log(
          'usuarioCompleto:',
          this.variablesCompartidas.usuarioCompleto()
        );
      },
      error: (err) => console.error(err),
      complete: () => {
        console.log('Usuario cargado:', this.user);
      },
    });
  }

  ngOnDestroy() {
    // Limpiar listener de resize
    window.removeEventListener('resize', this.checkMobileView.bind(this));
  }

  checkMobileView() {
    // Cerrar sidebar automáticamente en móvil
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;

    // Prevenir scroll cuando el sidebar está abierto en móvil
    if (this.sidebarOpen) {
      if (window.innerWidth < 768) {
        document.body.classList.add('no-scroll');
      }
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  checkInputStatus() {
    if (this.text != '') {
      this.sideMenu.nativeElement.classList.add('expanded');
      this.searchBar.nativeElement.classList.add('search-active');
      /*       this.card.nativeElement.classList.add('card-active'); */
      this.router.navigate(['main/eventSearch']);
    } else {
      this.sideMenu.nativeElement.classList.remove('expanded');
      this.searchBar.nativeElement.classList.remove('search-active');
      /*  this.card.nativeElement.classList.remove('card-active'); */
      this.router.navigate(['main/home']);
    }
  }

  clearInput() {
    this.text = '';
    this.variablesCompartidas.inputContent.set(this.text);
    this.checkInputStatus();
  }

  searchEvent(event: Event) {
    let inputElement = event.target as HTMLInputElement;
    let text = inputElement.value.trim();
    this.text = text;

    this.variablesCompartidas.inputContent.set(text);
    this.checkInputStatus();
  }

  public authService = inject(AuthService);
  public variablesCompartidas = inject(VariablesCompartidasService);

  valorInput = this.variablesCompartidas.inputContent();

  @ViewChild('inputSearch') inputSearch!: ElementRef;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('search') searchBar!: ElementRef;
  @ViewChild('card') card!: ElementRef;

  faSearch = faSearch;
  faHome = faHome;
  faUser = faUser;
  faHeart = faHeart;
  faCog = faCog;
  faDev = faDev;
  faMoon = faMoon;
  faSun = faSun;
  faXmark = faXmark;
  faSignOutAlt = faSignOutAlt;
  faCalendar = faCalendarDays;
  faBars = faBars;
  faThLarge = faThLarge;

  user?: UserI;
  username: string = '';

  asideItems = [
    { text: 'Home', icon: this.faHome, route: 'home' },
    { text: 'Eventos', icon: this.faHeart, route: '/main/misEventos' },
    { text: 'Categorías', icon: this.faThLarge, route: '/main/categorias' },
    { text: 'Calendario', icon: this.faCalendar, route: '/main/calendar' },
  ];

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? 'dark' : 'light';
    this.variablesCompartidas.tema.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
