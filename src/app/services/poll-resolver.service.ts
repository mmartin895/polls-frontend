import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Poll} from '../models/poll.model';
import {Observable} from 'rxjs';
import {DataStorageService} from './data-storage.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PollResolverService implements Resolve<Poll[]> {

  constructor(
    private dataStorageService: DataStorageService,
    private userService: UserService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Poll[]> | Promise<Poll[]> | Poll[] {
    if (route.url[0].toString() === 'list') {
      return this.dataStorageService.fetchPollsList(this.userService.user.value.id);
    } else if (route.url[0].toString() === 'explore') {
      return this.dataStorageService.fetchPollsList(null);
    }
  }
}
