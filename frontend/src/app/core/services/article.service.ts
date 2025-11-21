import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

interface ArticleListResponse {
  items: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private baseUrl = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  getArticles(params?: { page?: number; limit?: number; tag?: string; authorId?: string }): Observable<ArticleListResponse> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.tag) httpParams = httpParams.set('tag', params.tag);
    if (params?.authorId) httpParams = httpParams.set('authorId', params.authorId);

    return this.http.get<ArticleListResponse>(this.baseUrl, { params: httpParams });
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

createArticle(formData: FormData): Observable<Article> {
  return this.http.post<Article>(this.baseUrl, formData);
}

updateArticle(id: string, formData: FormData): Observable<Article> {
  return this.http.patch<Article>(`${this.baseUrl}/${id}`, formData);
}
  deleteArticle(id: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
