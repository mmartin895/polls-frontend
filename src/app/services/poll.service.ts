import { Injectable } from '@angular/core';
import {Poll, SubmittedPoll} from '../models/poll.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  pollsChanged = new Subject<Poll[]>();
  private polls: Poll[] = [];

  submittedPollsChanged = new Subject<SubmittedPoll[]>();
  private submittedPolls: SubmittedPoll[] = [];

  constructor() {
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

  public getSubmittedPollsList() {
    return this.submittedPolls.slice();
  }
}
