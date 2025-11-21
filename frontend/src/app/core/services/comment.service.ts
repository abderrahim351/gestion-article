import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  getCommentsForArticle(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/article/${articleId}`);
  }

  createComment(payload: { articleId: string; content: string; parentCommentId?: string | null }): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, payload);
  }
}
