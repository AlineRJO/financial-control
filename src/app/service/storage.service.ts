import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USER_KEY = 'userKey';

  constructor() { }

  setCurrentUser(key: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(key));
  }

  getCurrentUser(): string {
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY));
    } catch (e) {
      return null;
    }
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
