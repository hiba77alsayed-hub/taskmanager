import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout();
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}