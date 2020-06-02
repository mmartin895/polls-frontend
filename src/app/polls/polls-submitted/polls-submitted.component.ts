import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Poll, SubmittedPoll} from '../../models/poll.model';
import {PollService} from '../../services/poll.service';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../services/data-storage.service';
import {UserService} from '../../services/user.service';
import {Question} from '../../models/question.model';
import {QuestionService} from '../../services/question.service';

@Component({
  selector: 'app-polls-submitted',
  templateUrl: './polls-submitted.component.html',
  styleUrls: ['./polls-submitted.component.scss']
})
export class PollsSubmittedComponent implements OnInit, OnDestroy {
  @Input() poll: Poll;

  private submittedPollsSubscription: Subscription;
  submittedPolls: SubmittedPoll[] = [];

  private questionsSubscription: Subscription;
  questions: Question[] = [];

  constructor(
    private pollService: PollService,
    private questionsService: QuestionService,
    private dataStorageService: DataStorageService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.submittedPollsSubscription = this.pollService.submittedPollsChanged
      .subscribe((submittedPolls: SubmittedPoll[]) => {
        this.submittedPolls = submittedPolls;
        console.log('submitted polls', submittedPolls);
      });
    this.dataStorageService.fetchSubmittedPollsList(this.poll.id).subscribe();
    this.submittedPolls = this.pollService.getSubmittedPollsList();

    this.questionsSubscription = this.questionsService.questionsChanged
      .subscribe((questions: Question[]) => {
        this.questions = questions;
      });
    this.questions = this.questionsService.getQuestionsList();
  }

  ngOnDestroy(): void {
    this.submittedPollsSubscription.unsubscribe();
    // this.questionsSubscription.unsubscribe();
  }

}
