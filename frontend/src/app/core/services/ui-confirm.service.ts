import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

interface InternalConfirmState extends ConfirmDialogOptions {
  resolve?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class UiConfirmService {
  private currentState: InternalConfirmState | null = null;
  private dialogSubject = new BehaviorSubject<InternalConfirmState | null>(null);
  dialog$ = this.dialogSubject.asObservable();

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.currentState = {
        title: options.title || 'Confirmation',
        message: options.message || 'Êtes-vous sûr ?',
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        resolve,
      };

      this.dialogSubject.next(this.currentState);
    });
  }

  respond(result: boolean) {
    if (this.currentState && this.currentState.resolve) {
      this.currentState.resolve(result);
    }
    this.currentState = null;
    this.dialogSubject.next(null);
  }

  close() {
    this.respond(false);
  }
}
