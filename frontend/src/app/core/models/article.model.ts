import { User } from './user.model';

export interface Article {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
}
