import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //  جلب كل المهام - للـ Admin بس
  getAllTasks() {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  //  جلب مهام مستخدم معين - للـ User
  getUserTasks(userId: number) {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/user/${userId}`);
  }

  //  إضافة مهمة جديدة - للـ Admin بس
  addTask(task: Partial<Task>) {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  //  حذف مهمة - للـ Admin بس
  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`);
  }
}