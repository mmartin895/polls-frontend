import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../services/data-storage.service';
import {Poll, SubmittedPoll} from '../../models/poll.model';

@Component({
  selector: 'app-poll-favourite',
  templateUrl: './poll-favourite.component.html',
  styleUrls: ['./poll-favourite.component.scss']
})
export class PollFavouriteComponent implements OnInit {
  private polls: Poll[] = [];
  constructor(private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.dataStorage.fetchFavouritePollsList().subscribe((favouritePolls: Poll[]) => {
      this.polls = favouritePolls;
    });
  }

}
