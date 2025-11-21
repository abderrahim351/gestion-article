// src/app/features/articles/article-form/article-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';
import { environment } from '../../../../environments/environment';
import { UiNotificationService } from '../../../core/services/ui-notification.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-form.component.html',
})
export class ArticleFormComponent implements OnInit {
  isEdit = false;
  articleId: string | null = null;
  loading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  existingImageUrl: string | null = null;

  form = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    tags: [''],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private uiNotification: UiNotificationService
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.articleId;

    if (this.isEdit && this.articleId) {
      this.loading = true;
      this.articleService.getArticle(this.articleId).subscribe({
        next: (article: Article) => {
          this.form.patchValue({
            title: article.title,
            content: article.content,
            tags: article.tags?.join(', ') || '',
          });

          this.existingImageUrl = article.imageUrl || null;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    this.selectedFile = input.files[0];
  }

  getDisplayImageUrl(): string | null {
    if (!this.existingImageUrl) return null;

    if (this.existingImageUrl.startsWith('http')) {
      return this.existingImageUrl;
    }

    return environment.backendUrl + this.existingImageUrl;
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const { title, content, tags } = this.form.value;

    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('content', content || '');
    if (tags) {
      formData.append('tags', tags as string);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEdit && this.articleId) {
      this.articleService.updateArticle(this.articleId as string, formData).subscribe({
        next: (article) => {
          this.loading = false;
          this.uiNotification.showSuccess('Article modifié avec succès');
          this.router.navigate(['/articles', article._id]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Erreur';
          this.uiNotification.showError(this.error || 'Erreur');
        },
      });
    } else {
      this.articleService.createArticle(formData).subscribe({
        next: (article) => {
          this.loading = false;
          this.uiNotification.showSuccess('Article ajouté avec succès');
          this.router.navigate(['/articles', article._id]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Erreur';
          this.uiNotification.showError(this.error || 'Erreur');
        },
      });
    }
  }
}
