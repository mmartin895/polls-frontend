import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-poll-archived',
  templateUrl: './poll-archived.component.html',
  styleUrls: ['./poll-archived.component.scss']
})
export class PollArchivedComponent implements OnInit {

  polls: Poll[] = [];
  constructor(private pollservice: PollService) { }

  ngOnInit(): void {
    this.pollservice.getArchivedPolls().subscribe(polls => {
      this.polls = polls;
    });
  }

  restorePoll(poll:Poll):void {
    this.pollservice.restorePoll(poll.id).subscribe(()=>{
      this.polls.splice(this.polls.indexOf(poll), 1);
    });
  }
}
