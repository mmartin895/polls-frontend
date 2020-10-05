import { Injectable } from '@angular/core';
import {Poll, SubmittedPoll} from '../models/poll.model';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  pollsChanged = new Subject<Poll[]>();
  private polls: Poll[] = [];
  public pollsApiBaseUrl: string;
  public favoritePollsApiBaseUrl: string;

  submittedPollsChanged = new Subject<SubmittedPoll[]>();
  private submittedPolls: SubmittedPoll[] = [];

  constructor(private http: HttpClient) {
    const apiBaseEndpoint = environment.apiBaseUrl;
    this.pollsApiBaseUrl = `${apiBaseEndpoint}/polls/`;
    this.favoritePollsApiBaseUrl = `${apiBaseEndpoint}/favorite-polls/`;

  }

  public setPolls(polls: Poll[]) {
    this.polls = polls;
    this.pollsChanged.next(this.polls);
  }

  public getPollsList() {
    return this.polls.slice();
  }

  public setSubmittedPolls(polls: SubmittedPoll[]) {
    this.submittedPolls = polls;
    this.submittedPollsChanged.next(this.submittedPolls);
  }

  public addToFavorites(id: number){
    return this.http.post(this.favoritePollsApiBaseUrl, {poll: id});
  }

  public removeFromFavorites(id: number){
    return this.http.delete(`${this.favoritePollsApiBaseUrl}${id}`, {});
  }

  public getSubmittedPollsList() {
    return this.submittedPolls.slice();
  }

  public getArchivedPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.pollsApiBaseUrl}archived`);
  }

  public restorePoll(id: number): Observable<any> {
    return this.http.post(`${this.pollsApiBaseUrl}${id}/restore/`, {});
  }

  public deletePoll(id: number): Observable<any> {
    return this.http.delete(`${this.pollsApiBaseUrl}${id}/delete/`);
  }  

  public searchPolls(search: string): Observable<Poll[]> {
    let params;
    if (search) {
      params = new HttpParams().set('search', search);
    }
    return this.http.get<Poll[]>(this.pollsApiBaseUrl, {params});
  }
}
