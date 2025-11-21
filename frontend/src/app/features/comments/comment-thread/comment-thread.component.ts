import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../core/services/comment.service';
import { Comment } from '../../../core/models/comment.model';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { SocketService } from '../../../core/services/socket.service';
@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './comment-thread.component.html',
})
export class CommentThreadComponent implements OnInit {
  @Input() articleId!: string;

  comments: Comment[] = [];
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    content: ['', [Validators.required]],
  });

  replyingTo: string | null = null;
  replyForms: { [commentId: string]: string } = {};

  constructor(
    private commentService: CommentService,
    public auth: AuthService,
    private fb: FormBuilder,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.loadComments();

    this.socketService.onNewCommentNotification().subscribe((notif) => {
      if (notif.articleId === this.articleId) {
        this.loadComments(); // simple : on recharge
      }
    });
  }

  loadComments() {
    this.loading = true;
    this.commentService.getCommentsForArticle(this.articleId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  submitRootComment() {
    if (this.form.invalid) return;
    const content = this.form.value.content!;

    this.commentService
      .createComment({ articleId: this.articleId, content })
      .subscribe({
        next: () => {
          this.form.reset();
          this.loadComments();
        },
      });
  }

  startReply(commentId: string) {
    this.replyingTo = commentId;
    this.replyForms[commentId] = '';
  }

  cancelReply() {
    this.replyingTo = null;
  }

  submitReply(commentId: string) {
    const content = this.replyForms[commentId];
    if (!content || !content.trim()) return;

    this.commentService
      .createComment({
        articleId: this.articleId,
        content,
        parentCommentId: commentId,
      })
      .subscribe({
        next: () => {
          this.replyingTo = null;
          this.replyForms[commentId] = '';
          this.loadComments();
        },
      });
  }
}
