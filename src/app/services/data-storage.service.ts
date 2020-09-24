import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Poll, SubmittedPoll} from '../models/poll.model';
import {PollService} from './poll.service';
import {tap} from 'rxjs/operators';
import {Question} from '../models/question.model';
import {QuestionService} from './question.service';
import {constructExclusionsMap} from 'tslint/lib/rules/completed-docs/exclusions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  public usersApiBaseUrl: string;
  public pollsApiBaseUrl: string;
  public submittedPollsApiBaseUrl: string;
  public questionsApiBaseUrl: string;
  public answersApiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private pollService: PollService,
    private questionService: QuestionService
  ) {
    const apiBaseEndpoint = environment.apiBaseUrl;

    this.usersApiBaseUrl = `${apiBaseEndpoint}/users/`;
    this.pollsApiBaseUrl = `${apiBaseEndpoint}/polls/`;
    this.submittedPollsApiBaseUrl = `${apiBaseEndpoint}/submitted-polls/`;
    this.questionsApiBaseUrl = `${apiBaseEndpoint}/questions/`;
    this.answersApiBaseUrl = `${apiBaseEndpoint}/answers/`;
  }

  createPoll(payload: any) {
    return this.http.post(this.pollsApiBaseUrl, payload);
  }

  submitPoll(payload: any) {
    return this.http.post(this.submittedPollsApiBaseUrl, payload);
  }

  archivePoll(pollId: string) {
    return this.http.post(`${this.pollsApiBaseUrl}${pollId}/archive/`, {});
  }

  updatePoll(payload: any, pollId: string) {
    return this.http.put(`${this.pollsApiBaseUrl}${pollId}/`, payload);
  }

  fetchSubmittedPollsList(poll: number): Observable<SubmittedPoll[]> {
    let params;
    if (poll) {
      params = new HttpParams().set('poll', String(poll));
    }
    return this.http.get<SubmittedPoll[]>(this.submittedPollsApiBaseUrl, {params: params})
      .pipe(
        tap((polls: SubmittedPoll[]) => {
          this.pollService.setSubmittedPolls(polls);
        })
      );
  }

  fetchSubmittedPollForUser(poll: number): Observable<SubmittedPoll[]> {
    let params;
    if (poll) {
      params = new HttpParams().set('poll', String(poll));
    }
    return this.http.get<SubmittedPoll[]>(this.submittedPollsApiBaseUrl, {params: params});
  }

  fetchPollsList(user: string): Observable<Poll[]> {
    let params;
    if (user) {
      params = new HttpParams().set('user', user);
    }
    return this.http.get<Poll[]>(this.pollsApiBaseUrl, {params: params})
      .pipe(
        tap((polls: Poll[]) => {
          this.pollService.setPolls(polls);
        })
    );
  }
  fetchFavouritePollsList(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.pollsApiBaseUrl + 'favorites');
  }

  fetchQuestionsListFilteredByPoll(id: number): Observable<Question[]> {
    const params = new HttpParams().set('poll', JSON.stringify(id));
    return this.http.get<Question[]>(this.questionsApiBaseUrl, {params: params})
      .pipe(
        tap((questions: Question[]) => {
          this.questionService.setQuestions(questions);
        })
      );
  }
}
