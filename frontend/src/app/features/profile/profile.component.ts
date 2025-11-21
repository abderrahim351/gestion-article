import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UiNotificationService } from '../../core/services/ui-notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }], 
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private uiNotification: UiNotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          email: user.email,
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur de chargement du profil';
      },
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const name = this.form.get('name')?.value || '';

    this.userService.updateMe({ name }).subscribe({
      next: (user) => {
        this.loading = false;
        this.auth.updateCurrentUser({ name: user.name });
        this.uiNotification.showSuccess('Profil mis à jour avec succès');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la mise à jour';
        this.uiNotification.showError(this.error || 'Erreur');
      },
    });
  }
}
