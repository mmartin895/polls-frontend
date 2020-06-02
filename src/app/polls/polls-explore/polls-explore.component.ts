import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Poll} from '../../models/poll.model';
import {PollService} from '../../services/poll.service';
import {DataStorageService} from '../../services/data-storage.service';

@Component({
  selector: 'app-polls-explore',
  templateUrl: './polls-explore.component.html',
  styleUrls: ['./polls-explore.component.scss']
})
export class PollsExploreComponent implements OnInit, OnDestroy {
  pollsSubscription: Subscription;
  polls: Poll[] = [];
  selectedPoll: Poll;

  constructor(
    private pollService: PollService,
    private dataStorageService: DataStorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pollsSubscription = this.pollService.pollsChanged
      .subscribe((polls: Poll[]) => {
        this.polls = polls;
        console.log('polls', polls);
      });
    this.polls = this.pollService.getPollsList();
  }

  ngOnDestroy(): void {
    this.pollsSubscription.unsubscribe();
  }

  selectPoll(event, poll: Poll) {
    this.changeSelectedPoll(poll);
    this.dataStorageService.fetchQuestionsListFilteredByPoll(poll.id).subscribe();
    console.log(poll);
  }

  activateCreatePollMode() {
    this.changeSelectedPoll(null);
  }

  changeSelectedPoll(poll: Poll) {
    const pollItem = this.polls.find(p => p.selected);
    if (pollItem) {
      pollItem.selected = false;
    }
    if (poll) {
      poll.selected = true;
      this.selectedPoll = poll;
    } else {
      this.selectedPoll = null;
    }
  }

  pollSubmitted(event) {

  }
}
