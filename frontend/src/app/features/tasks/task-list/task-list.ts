import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task';
import { AuthService } from '../../../core/services/auth';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {

  taskService = inject(TaskService);
  authService = inject(AuthService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    if (this.authService.isAdmin()) {
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error(err)
      });
    } else {
      const userId = this.authService.currentUser()?.id!;
      this.taskService.getUserTasks(userId).subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error(err)
      });
    }
  }

  onLogout() {
    this.authService.logout();
  }

  deleteTask(taskId: number) {
  this.taskService.deleteTask(taskId).subscribe({
    next: () => {
      // ✅ نحذف المهمة من القائمة بدون ما نرجع للباك
      this.tasks = this.tasks.filter(t => t.id !== taskId);
    },
    error: (err) => console.error(err)
  });
}

}