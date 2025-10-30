import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private _currentLang = new BehaviorSubject<string>('es');
  currentLang$ = this._currentLang.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('lang');
      if (storedLang) this._currentLang.next(storedLang);
    }
  }

  changeLang(lang: string) {
    this._currentLang.next(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }

  get currentLang() {
    return this._currentLang.value;
  }
}
