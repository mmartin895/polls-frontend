import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../../services/data-storage.service';
import {Poll, SubmittedPoll} from '../../models/poll.model';
import {ARCHIVE_MANAGEMENT_PERMISSION, UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-poll-favourite',
  templateUrl: './poll-favourite.component.html',
  styleUrls: ['./poll-favourite.component.scss']
})
export class PollFavouriteComponent implements OnInit, OnDestroy {
  private user: User;
  public polls: Poll[] = [];
  private userSub: Subscription;
  constructor(private dataStorage: DataStorageService, private userService: UserService, private cdr: ChangeDetectorRef) { }
  public selectedPoll: Poll;
  ngOnInit(): void {
    this.dataStorage.fetchFavouritePollsList().subscribe((favouritePolls: Poll[]) => {
      this.polls = favouritePolls;
    });
    this.userSub = this.userService.user.subscribe(user => {
      this.user = user;
    });
  }
  ngOnDestroy(): void{
    this.userSub.unsubscribe();
  }
  editPoll(poll: Poll): void{
    // this.selectedPoll = null;
    // this.cdr.detectChanges();
    this.selectedPoll = poll;
    // this.cdr.detectChanges();
  }
  isMyPoll(poll: Poll): boolean{
    return this.user != null && this.user.email === poll.user;
  }
}
