import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/tasks/task-list/task-list').then(m => m.TaskList)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/admin/admin-panel/admin-panel').then(m => m.AdminPanel)
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () =>
            import('./features/admin/admin-panel/admin-panel').then(m => m.AdminPanel)
    },
    {
        path: '**',
        loadComponent: () =>
            import('./features/not-found/not-found').then(m => m.NotFound)
    }
];