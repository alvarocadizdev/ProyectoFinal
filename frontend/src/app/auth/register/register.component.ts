import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
   styleUrl: './register.component.css',
})
export class RegisterComponent {
  user = {
    email: '',
    password: ''
  };
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: err => alert(err.error.message || 'Error al registrarse')
    });
  }
}
