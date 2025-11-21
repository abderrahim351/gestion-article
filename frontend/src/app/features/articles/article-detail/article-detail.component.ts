import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';
import { AuthService } from '../../../core/services/auth.service';
import { CommentThreadComponent } from '../../comments/comment-thread/comment-thread.component';
import { environment } from '../../../../environments/environment';
import { UiNotificationService } from '../../../core/services/ui-notification.service';
import { UiConfirmService } from '../../../core/services/ui-confirm.service';
@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentThreadComponent],
  templateUrl: './article-detail.component.html',
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    public auth: AuthService,
    private uiNotification: UiNotificationService,
     private confirmService: UiConfirmService 
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;

    this.articleService.getArticle(id).subscribe({
      next: (res) => {
        this.article = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
getImageUrl(): string | null {
  if (!this.article?.imageUrl) return null;

  if (this.article.imageUrl.startsWith('http')) {
    return this.article.imageUrl;
  }

  return environment.backendUrl + this.article.imageUrl;
}

  canEdit(): boolean {
    const user = this.auth.getCurrentUser();
    if (!user || !this.article) return false;

    if (user.role === 'ADMIN' || user.role === 'EDITOR') return true;
    if (user.role === 'WRITER' && this.article.author?.id === user.id) return true;

    return false;
  }

  canDelete(): boolean {
    const user = this.auth.getCurrentUser();
    return !!user && user.role === 'ADMIN';
  }

async deleteArticle() {
  if (!this.article?._id) return;

  const confirmed = await this.confirmService.confirm({
    title: 'Suppression de l’article',
    message: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
  });

  if (!confirmed) {
    return;
  }

  this.articleService.deleteArticle(this.article._id).subscribe({
    next: () => {
      this.uiNotification.showSuccess('Article supprimé avec succès');
      this.router.navigate(['/articles']);
    },
    error: (err) => {
      const msg = err.error?.message || 'Erreur lors de la suppression';
      this.uiNotification.showError(msg);
    },
  });
}


}
