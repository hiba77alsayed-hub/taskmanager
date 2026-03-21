import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanel {

  authService = inject(AuthService);
  users: User[] = [];

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUsers();
      }
    });
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error(err)
    });
  }
}