import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faUser,
  faSun,
  faMoon,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FontAwesomeModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username: string = '';
  isAdmin: boolean = false;
  visible = false;
  isDarkTheme = false;

  // FontAwesome icons
  faHome = faHome;
  faUser = faUser;
  faSun = faSun;
  faMoon = faMoon;
  faSignOutAlt = faSignOutAlt;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.user;
    this.username = user.user?.username || 'User';
    this.isAdmin = user.isAdmin;

    console.log('Main Component Initialized', {
      authenticated: this.authService.isAuthenticated(),
      user: this.authService.user,
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showMenu() {
    if (!this.visible) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }
}
