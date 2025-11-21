import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { UiConfirmService } from '../../../core/services/ui-confirm.service';
import { ConfirmDialogOptions } from '../../../core/services/ui-confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  visible = false;
  options: ConfirmDialogOptions = {};

  constructor(private confirmService: UiConfirmService) {
    this.confirmService.dialog$.subscribe((state) => {
      if (state) {
        this.options = {
          title: state.title,
          message: state.message,
          confirmText: state.confirmText,
          cancelText: state.cancelText,
        };
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  onConfirm() {
    this.confirmService.respond(true);
  }

  onCancel() {
    this.confirmService.respond(false);
  }
}
