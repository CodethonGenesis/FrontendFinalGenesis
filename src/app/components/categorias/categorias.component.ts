import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { UserService } from '../../services/user.service';
import { authGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { find } from 'rxjs';
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
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, NgClass, FontAwesomeModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export default class CategoriasComponent implements OnInit {
  constructor(
    public categoryService: CategoryService,
    public userService: UserService,
    private authService: AuthService
  ) {
    effect(() => {
      this.categories = this.categoryService.categorias();
      console.log('valor del effect : ', this.categoryService.categorias());
    });
  }

  faSearch = faSearch;
  faHome = faHome;
  faUser = faUser;
  faHeart = faHeart;
  faBookmark = faBookmark;
  faCog = faCog;
  faList = faList;
  faMoon = faMoon;
  faSun = faSun;
  faXmark = faXmark;
  faSignOutAlt = faSignOutAlt;
  faCalendar = faCalendarDays;

  favoritos: boolean = true;
  username: string = '';
  user: User | null = null;

  ngOnInit(): void {
    this.getCategories();
    const storedUser = sessionStorage.getItem('login');
    console.log('Usuario: ', storedUser);
    const user = this.authService.user;
    this.username = user.user?.username || 'User';
    this.findByUsername();
  }

  isFollowing(categoria: Category): boolean {
    return categoria.seguidores.some((user) => user.id === this.user!.id);
    /* Array.isArray(categoria.seguidores) &&
      categoria.seguidores.some((user) => user.id === this.user!.id) */
  }

  categories: Category[] = [];
  favoritosCategories: Category[] = [];

  /*   getCategories() {
    this.categoryService.findAll().subscribe((categories) => {
      this.categories = this.categoryService.categorias();
      this.categoryService.setCategorias(categories);
      console.log(categories);
    });
  } */

  getCategories() {
    this.categoryService.findAll().subscribe((categories) => {
      // Guarda las categorías en el servicio
      this.categoryService.setCategorias(categories);

      // Recorre cada categoría para marcar si el usuario actual está entre los seguidores
      categories.forEach((category) => {
        // Asegúrate de que category.seguidores exista
        const seguidores = category.seguidores || [];

        // Comprueba si el usuario actual está entre los seguidores
        const isFollowed = seguidores.some((user) => user.id === this.user!.id);

        // Añade la propiedad booleana a la categoría
        category.isFollowedByUser = isFollowed;
      });

      // Guarda en el componente
      this.categories = categories;

      console.log(this.categories);
    });
  }

  findByUsername() {
    this.userService.findByUsername(this.username).subscribe((user) => {
      console.log(user);
      this.user = user;
      this.favoritosCategories = user.categorias!;
      console.log('Categorias Favoritas: ', this.favoritosCategories);
    });
  }
}
