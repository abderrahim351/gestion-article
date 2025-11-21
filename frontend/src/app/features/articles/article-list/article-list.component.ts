import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SlicePipe],
  templateUrl: './article-list.component.html',
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading = false;

  constructor(
    private articleService: ArticleService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.articleService.getArticles({ page: 1, limit: 20 }).subscribe({
      next: (res) => {
        this.articles = res.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getImageUrl(article: Article): string | null {
    if (!article.imageUrl) return null;

    if (article.imageUrl.startsWith('http')) {
      return article.imageUrl;
    }

    return environment.backendUrl + article.imageUrl;
  }
  canCreate(): boolean {
    const user = this.auth.getCurrentUser();
    if (!user) return false;
    return ['ADMIN', 'EDITOR', 'WRITER'].includes(user.role);
  }
}
