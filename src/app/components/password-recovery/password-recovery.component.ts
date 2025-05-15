import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { InputOtpModule } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    InputOtpModule,
    PasswordModule,
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css',
})
export class PasswordRecoveryComponent {
  userCredentials: string = '';
  email: string = '';
  usuario: any = {
    username: '',
    password: '',
    email: '',
    name: '',
    lastname: '',
    id: 0,
  };
  constructor(
    private router: Router,
    private UserService: UserService,
    private passwordRecoveryService: PasswordRecoveryService
  ) {}

  obtenerUsuarioPorNombre() {
    this.passwordRecoveryService
      .findByUserName(this.userCredentials)
      .subscribe((data) => {
        this.usuario = data;
        console.log('Usuario encontrado: ' + this.usuario.email);

        console.log(this.usuario);
        this.passwordRecoveryService.sendEmail(this.usuario.email).subscribe({
          next: (response) => {
            console.log('Email enviado: ' + response);
            Swal.fire(
              'Email enviado a ' + this.usuario.email + '!',
              '',
              'success'
            );
            const formUserName = document.getElementById('formUserName');
            const otp = document.getElementById('otp');

            if (formUserName && otp) {
              formUserName.style.display = 'none';
              otp.style.display = 'flex';
            }
          },
          error: (error) => {
            console.error('Error al enviar el email: ' + error.message);
            Swal.fire(
              'Error',
              'Error al enviar el email: ' + error.message,
              'error'
            );
          },
        });
      });
  }

  emailExistente() {
    this.passwordRecoveryService
      .emailExists(this.usuario.email)
      .subscribe((data) => {
        if (data) {
          console.log('El email ya existe: ' + this.usuario.email);
          Swal.fire('El email ya existe: ' + this.usuario.email, '', 'error');
        } else {
          console.log('El email no existe: ' + this.usuario.email);
        }
      });
    this.passwordRecoveryService.sendEmail(this.usuario.email).subscribe({
      next: (response) => {
        console.log('Email enviado: ' + response);
        Swal.fire('Email enviado a ' + this.usuario.email + '!', '', 'success');
      },
      error: (error) => {
        console.error('Error al enviar el email: ' + error.message);
        Swal.fire(
          'Error',
          'Error al enviar el email: ' + error.message,
          'error'
        );
      },
    });
  }

  onSubmit(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const inputElement = document.getElementById(
      'userCredentials'
    ) as HTMLInputElement | null;
    console.log(inputElement?.value);

    this.userCredentials = inputElement?.value || '';

    if (emailRegex.test(this.userCredentials)) {
      this.passwordRecoveryService
        .emailExists(this.userCredentials)
        .subscribe((data) => {
          console.log('El email existe: ' + this.userCredentials);
          if (data) {
            this.passwordRecoveryService
              .sendEmail(this.userCredentials)
              .subscribe({
                next: (response) => {
                  console.log('Email enviado: ' + response);
                  Swal.fire(
                    'Email enviado a ' + this.userCredentials + '!',
                    '',
                    'success'
                  );
                  const formUserName = document.getElementById('formUserName');
                  const otp = document.getElementById('otp');

                  if (formUserName && otp) {
                    formUserName.style.display = 'none';
                    otp.style.display = 'flex';
                  }
                },
                error: (error) => {
                  console.error('Error al enviar el email: ' + error.message);
                  Swal.fire(
                    'Error',
                    'Error al enviar el email: ' + error.message,
                    'error'
                  );
                },
              });
          }
        });
    } else if (this.userCredentials !== '') {
      this.obtenerUsuarioPorNombre();
    } else {
      Swal.fire('Error', 'Usuario no encontrado', 'error');
    }
  }

  otpValue: string = ''; // Valor inicial del OTP
  passwordValue: string = ''; // Valor inicial de la contraseña
  confirmPasswordValue: string = ''; // Valor inicial de la confirmación de contraseña
  confirmPasswordTouched: boolean = false; // Inicialización de confirmPasswordTouched

  onOtpChange(value: string) {
    if (value.length === 6) {
      console.log('Código completo:', value);

      if (this.userCredentials === '') {
        this.email = this.usuario.email;
      } else {
        this.email = this.userCredentials;
      };

      this.passwordRecoveryService.verifyCode(this.email, value).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Código verificado correctamente:', response.message);
            Swal.fire(
              'Éxito',
              'Código verificado correctamente: ' + response.success,
              'success'
            );
            const otp = document.getElementById('otp');
            const passChanger = document.getElementById('passChanger');
            if (otp && passChanger) {
              otp.style.display = 'none';
              passChanger.style.display = 'flex';
            }
            // Aquí puedes continuar con el flujo, como redirigir al usuario
          } else {
            console.error('Error al verificar el código:', response);
            Swal.fire(
              'Error',
              'Error al verificar el código: ' + response.message,
              'error'
            );
          }
        },
        error: (error) => {
          console.error(
            'Error en la verificación del código:',
            error.message.message
          );
          Swal.fire(
            'Error',
            'Error en la verificación del código: ' + error.message.message,
            'error'
          );
        },
      });
    }
  }

  changePassword() {

    if (this.userCredentials === '') {
      this.email = this.usuario.email;
    } else {
      this.email = this.userCredentials;
    };

    this.passwordRecoveryService
      .resetPassword(this.email, this.otpValue, this.passwordValue)
      .subscribe({
        next: (response) => {
          console.log('Contraseña cambiada correctamente:', response);
          Swal.fire(
            'Éxito',
            'Contraseña cambiada correctamente: ' + response,
            'success'
          ).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err.error);
          Swal.fire(
            'Error',
            'Error al cambiar la contraseña: la contraseña no puede ser igual a la anterior',
            'error'
          );
        },
      });
  }
}
