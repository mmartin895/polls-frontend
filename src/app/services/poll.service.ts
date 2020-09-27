import { Injectable } from '@angular/core';
import {Poll, SubmittedPoll} from '../models/poll.model';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

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
}
