import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  author: User;
  article: string;
  parentComment: string | null;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}
