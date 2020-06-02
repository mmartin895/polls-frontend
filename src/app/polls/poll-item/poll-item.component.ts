import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Poll} from '../../models/poll.model';
import {DataStorageService} from '../../services/data-storage.service';
import {UserService} from '../../services/user.service';
import {environment} from '../../../environments/environment';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'app-poll-item',
  templateUrl: './poll-item.component.html',
  styleUrls: ['./poll-item.component.scss']
})
export class PollItemComponent implements OnInit {
  @Input() poll: Poll;
  @Input() answerMode: boolean;
  @Output() editPoll: EventEmitter<boolean> = new EventEmitter();
  @Output() listSubmittedAnswers: EventEmitter<boolean> = new EventEmitter();

  pollLink: string;

  constructor(
    private dataStorageService: DataStorageService,
    private userService: UserService,
    private toastr: NbToastrService
  ) {
  }

  ngOnInit(): void {
    const domainUrl = environment.domainUrl;
    this.pollLink = `${domainUrl}/polls/explore/${this.poll.id}/`;
  }

  editPollEmitted() {
    this.editPoll.emit(true);
  }

  listSubmittedAnswersEmitted() {
    this.listSubmittedAnswers.emit(false);
  }

  archivePoll() {
    this.dataStorageService.archivePoll(String(this.poll.id)).subscribe(success => {
      if (this.userService.user.value.id) {
        this.dataStorageService.fetchPollsList(this.userService.user.value.id).subscribe();
      }
    }, error => {
      console.log(error);
    });
  }

  linkCopied(event) {
    this.toastr.show(
      null,
      'Successfully copied poll link',
      { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
}
