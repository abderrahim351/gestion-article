import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  get(key: string): string | null {
    if (!this.isBrowser()) return null;
    return window.localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (!this.isBrowser()) return;
    window.localStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(key);
  }
}
