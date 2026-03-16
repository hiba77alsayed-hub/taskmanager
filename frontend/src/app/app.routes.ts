import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect home to login
    { path: 'login', component: LoginComponent },
    {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list').then(m => m.TaskList)
    } // Lazy Loading for performance
];
