import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../interfaces/user';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    imports: [FormsModule, HttpClientModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User = new User();
  users: User[] = [];
  paginator: any = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeSubscriptions(): void {
    const loginSub = this.sharingData.handlerLoginEventEmitter.subscribe(
      this.handleLoginResponse.bind(this)
    );

    const userSub = this.sharingData.findUserByIdEventEmitter.subscribe(
      this.handleFindUser.bind(this)
    );

    this.subscriptions.push(loginSub, userSub);
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.sharingData.handlerLoginEventEmitter.emit({
        username: this.user.username,
        password: this.user.password,
      });
    }
  }

  private validateForm(): boolean {
    if (!this.user.username || !this.user.password) {
      Swal.fire(
        'Error de validación',
        '¡Username y password son requeridos!',
        'error'
      );
      return false;
    }
    return true;
  }

  private handleLoginResponse({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): void {
    this.authService.loginUser({ username, password }).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = this.authService.getPayload(token);

        this.authService.token = token;
        this.authService.user = {
          user: { username: payload!.sub },
          isAuth: true,
          isAdmin: payload!.isAdmin,
        };

        this.router.navigate(['/main']);
      },
      error: (error) => {
        if (error.status === 401) {
          Swal.fire('Error en el Login', error.error.message, 'error');
        } else {
          console.error('Login error:', error);
          Swal.fire('Error', 'An unexpected error occurred', 'error');
        }
      },
    });
  }

  private handleFindUser(id: number): void {
    const user = this.users.find((user) => user.id === id);
    this.sharingData.selectUserEventEmitter.emit(user);
  }
}
