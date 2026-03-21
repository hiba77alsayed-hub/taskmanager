import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. جلب التوكن من الذاكرة المحلية
  const token = localStorage.getItem('token');

  // 2. إذا وجدنا توكن، نقوم بعمل "نسخة" من الطلب ونضيف إليها التوكن
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  // 3. إذا لم يوجد توكن، نرسل الطلب كما هو (مثلاً لطلب تسجيل الدخول)
  return next(req);
};
