import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task';
import { AuthService } from '../../../core/services/auth';
import { Task } from '../../../core/models/task.model';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList {

  taskService = inject(TaskService);
  authService = inject(AuthService);

  tasks: Task[] = [];
  showForm = false;

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadTasks();
      }
    });
  }

  loadTasks() {
    if (this.authService.isAdmin()) {
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error(err)
      });
    } else {
      this.taskService.getUserTasks(0).subscribe({
        next: (tasks) => this.tasks = tasks,
        error: (err) => console.error(err)
      });
    }
  }

  onTaskAdded() {
    this.showForm = false;
    this.loadTasks();
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
      },
      error: (err) => console.error(err)
    });
  }
}