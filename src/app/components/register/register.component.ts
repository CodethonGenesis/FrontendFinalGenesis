// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';
import { UserI } from '../../interfaces/userI';
import { routes } from '../../app.routes';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: UserI;
  users: UserI[] = [];
  loading: boolean = false;
  repeatPassword: string = '';

  constructor(
    private userService: UserService,
    private sharingData: SharingDataService,
    private router: Router
  ) {
    /*     this.user = new User(); */
    this.user = {
      userName: '',      // Required
      password: '',      // Required
      email: '',        // Optional but must be valid if provided
      name: '',         // Optional
      lastName: '',     // Optional
      documento: '',    // Optional
      registro: new Date() // Optional, set to current date
    };
  }

  isPasswordMatching(): boolean {
    return (
      this.user.password?.trim() !== '' &&
      this.repeatPassword?.trim() !== '' &&
      this.user.password === this.repeatPassword
    );
  }
  ngOnInit(): void {
    /*   this.loadALL(); */
  }

  /*   loadALL() {
    this.userService.findAll().subscribe((data) => {
      this.users = data; // Assign response data to the users property
      console.log(this.users); // Log the users array
    });
  } */

  onSubmit(registerForm: NgForm) {
    // Verifica si las contraseñas coinciden
    if (this.user.password !== this.repeatPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
      });
      return; // Detiene el envío del formulario
    }

    this.loading = true;
    this.userService.register(this.user).subscribe({
      next: (userNew) => {
        this.loading = false;

        Swal.fire({
          title: 'Usuario creado!',
          text: 'Registro exitoso.',
          icon: 'success',
        });

        registerForm.reset(); // Resetea el formulario
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar el usuario.',
          icon: 'error',
        });
      },
    });
  }
}
