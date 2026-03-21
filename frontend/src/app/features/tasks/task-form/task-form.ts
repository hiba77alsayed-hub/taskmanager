import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskAdded = output<void>();

  taskForm = this.fb.group({
    title: ['', Validators.required],
    userId: ['', Validators.required]
  });

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.addTask({
        title: this.taskForm.value.title!,
        userId: parseInt(this.taskForm.value.userId!)
      }).subscribe({
        next: () => {
          this.taskForm.reset();
          this.taskAdded.emit();
        },
        error: (err) => console.error(err)
      });
    }
  }
}