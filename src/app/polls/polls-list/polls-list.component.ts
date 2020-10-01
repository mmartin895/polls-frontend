import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Poll} from '../../models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../services/poll.service';
import {DataStorageService} from '../../services/data-storage.service';

@Component({
  selector: 'app-polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.scss']
})
export class PollsListComponent implements OnInit, OnDestroy {

  pollsSubscription: Subscription;
  polls: Poll[] = [];
  selectedPoll: Poll;
  createPollMode: boolean;
  editMode: boolean;

  constructor(
    private pollService: PollService,
    private dataStorageService: DataStorageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pollsSubscription = this.pollService.pollsChanged
      .subscribe((polls: Poll[]) => {
        this.polls = polls;
      });
    this.polls = this.pollService.getPollsList();
  }

  ngOnDestroy(): void {
    this.pollsSubscription.unsubscribe();
  }

  selectPoll(event, poll: Poll) {
    // this.createPollMode = null;
    // this.selectedPoll = null;
    // this.editMode = false;
    // this.cdr.detectChanges();
    this.createPollMode = event;
    this.editMode = event;
    this.selectedPoll = poll;
    // this.cdr.detectChanges();
    this.dataStorageService.fetchQuestionsListFilteredByPoll(poll.id).subscribe();
  }

  activateCreatePollMode() {
    // this.createPollMode = null;
    // this.selectedPoll = null;
    // this.editMode = false;
    // this.cdr.detectChanges();
    this.createPollMode = true;
    this.editMode = false;
    this.selectedPoll = null;
    // this.cdr.detectChanges();
  }

  pollSubmitted(event) {
    this.createPollMode = false;
    this.selectedPoll = null;
    this.editMode = false;
  }

}
