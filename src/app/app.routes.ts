import { Routes } from '@angular/router';

/* Auth */
import { authGuard } from './guards/auth.guard';

/* Login / Register forms */
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

/* Components */
import { MainComponent } from './components/main/main.component';

import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component'),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./components/categorias/categorias.component'),
      },
      {
        path: 'ajustes',
        loadComponent: () => import('./components/ajustes/ajustes.component'),
      },
      {
        path: 'misEventos',
        loadComponent: () =>
          import('./components/userEvents/userEvents.component'),
        children: [
          { path: '', redirectTo: 'misEventosCreados', pathMatch: 'full' },
          {
            path: 'misEventosCreados',
            loadComponent: () =>
              import(
                './components/userEvents/eventosCreados/eventosCreados.component'
              ),
          },
        ],
      },
      {
        path: 'eventSearch',
        loadComponent: () =>
          import('./components/eventSearch/eventSearch.component'),
      },
      {
        path: 'evento/:id',
        loadComponent: () => import('./components/Event/Event.component'),
      },
      {
        path: 'seccion/:id',
        loadComponent: () => import('./components/section/section.component'),
      },
      {
        path: 'admin-panel',
        loadComponent: () =>
          import(
            './components/backoffice/admin-panel/admin-panel.component'
          ).then((m) => m.AdminPanelComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./components/calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
      { path: 'eventSlider',
        loadComponent: () =>
          import('./components/home-slider/event-slider/event-slider.component').then(
            (m) => m.EventSliderComponent
          ),

      }
    ],
  },

  { path: 'register', component: RegisterComponent },
  { path: 'passwordRecovery', component: PasswordRecoveryComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
