import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());

  constructor(private router: Router) { }

  public isAuthenticated(): boolean {
    const token = this.tokenSubject.value;
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return true;
      } catch (error) {
        console.error('Invalid token specified:', error);
        return false;
      }
    }
    return false;
  }

  public getUserRole(): string | null {
    const token = this.tokenSubject.value;
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    } catch (error) {
      console.error('Invalid token');
      return null;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
    console.log('Token set:', token);  // Debug log
  }

  public clearToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    console.log('Token cleared');  // Debug log
  }

  public getTokenObservable() {
    return this.tokenSubject.asObservable();
  }
}


