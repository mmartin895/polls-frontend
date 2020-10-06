import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { YesNoDialogComponent } from 'src/app/yesno-dialog.component';

@Component({
  selector: 'app-poll-archived',
  templateUrl: './poll-archived.component.html',
  styleUrls: ['./poll-archived.component.scss']
})
export class PollArchivedComponent implements OnInit {

  polls: Poll[] = [];
  constructor(private pollservice: PollService,
    private dialogService: NbDialogService) { }

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

  deletePoll(poll:Poll):void {
    this.dialogService.open(YesNoDialogComponent, 
      { context: { 
        title: "Delete",
        body: `Are you sure you want to permanently delete poll ${poll.title}?`  
      }})
    .onClose.subscribe(result => {
      if (result) {
        this.pollservice.deletePoll(poll.id).subscribe(()=>{
          this.polls.splice(this.polls.indexOf(poll), 1);
        });
      }
    });    
  }
}