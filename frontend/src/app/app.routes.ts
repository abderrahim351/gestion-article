import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ArticleListComponent } from './features/articles/article-list/article-list.component';
import { ArticleDetailComponent } from './features/articles/article-detail/article-detail.component';
import { ArticleFormComponent } from './features/articles/article-form/article-form.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'articles', component: ArticleListComponent, canActivate: [authGuard] },
  { path: 'articles/new', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'articles/:id', component: ArticleDetailComponent, canActivate: [authGuard] },
  { path: 'articles/:id/edit', component: ArticleFormComponent, canActivate: [authGuard] },

  { path: 'admin/users', component: UserManagementComponent, canActivate: [authGuard, adminGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'articles' },
];
