export interface User {
    id: number;
    email: string;
    role: 'admin' | 'user';
    token?: string;
}