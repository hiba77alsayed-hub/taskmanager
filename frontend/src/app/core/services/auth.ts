import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user'; 
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; // تأكدي من المسار في الباك أند
  private readonly TOKEN_KEY = 'auth_token'; // ثابت لمنع الأخطاء الإملائية

  // 2. إدارة الحالة باستخدام Signals
  // نقوم بمحاولة قراءة المستخدم من الذاكرة عند البداية
  currentUser = signal<User | null>(null);

  // 3. الـ Computed Signals (تحدث نفسها تلقائياً)
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    // خطوة أمان: عند تشغيل التطبيق، نتأكد إذا كان هناك توكن قديم
    this.checkInitialAuth();
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUser.set(res.user);
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(null); // معالجة الخطأ لكي لا يتوقف التطبيق
      })
    );
  }

  private checkInitialAuth() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // هنا يفضل عمل طلب للباك أند للتأكد أن التوكن لا يزال صالحاً (Valid)
      // حالياً سنفترض أنه صالح ونقوم بضبط الحالة (أو استرجاع بيانات المستخدم من التوكن)
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
  }
  
}
