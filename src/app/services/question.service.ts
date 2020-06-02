import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Question} from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questionsChanged = new Subject<Question[]>();
  private questions: Question[] = [];

  constructor() {
  }

  public setQuestions(questions: Question[]) {
    this.questions = questions;
    this.questionsChanged.next(this.questions);
  }

  public getQuestionsList() {
    return this.questions.slice();
  }
}
