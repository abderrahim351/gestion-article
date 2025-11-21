import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  roles: User['role'][] = ['ADMIN', 'EDITOR', 'WRITER', 'READER'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors du chargement des utilisateurs';
      },
    });
  }

  onRoleChange(user: User, newRole: User['role']) {
    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: (updated) => {
        user.role = updated.role; 
      },
      error: () => {
        this.loadUsers();
      },
    });
  }
}
