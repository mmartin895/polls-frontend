import {Question} from './question.model';

export interface Poll {
  id: number;
  title: string;
  description: string;
  archived: boolean;
  premium: boolean;
  url?: string;
  archived_at: string;
  created_at: string;
  questions: Question[];
  selected?: boolean;
  user: string;
  isFavorite: boolean;
}

export interface SubmittedPoll {
  id: number;
  poll: any;
  answered_at: string;
  user: string;
  answers: any[];
}
