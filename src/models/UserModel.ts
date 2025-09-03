

export interface User {
    uid: number;
    name: string;
    email: string;
    role: 'CLIENTE' | 'ADMIN' | 'TALLER' | 'VENDEDOR';
    lastConnection: Date;
    status: 'ACTIVE' | 'INACTIVE';

}