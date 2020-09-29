import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user.model';
import {NbAuthService} from '@nebular/auth';
import {map} from 'rxjs/operators';

export const ARCHIVE_MANAGEMENT_PERMISSION: string = 'archived_polls_administration';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new BehaviorSubject<User>(null);

  constructor(
    private authService: NbAuthService
  ) { }

  public handleAuthentication(username: string, email: string, userId: string, token: string, permissions: string[]) {
    const user = new User(
      username,
      email,
      userId,
      token,
      permissions
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logoutUser() {
    this.user.next(null);
    localStorage.removeItem('userData');
  }

  autoLogin() {
    const userData: {
      username: string,
      email: string,
      id: string,
      token: string,
      permissions: string[]
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.username, userData.email, userData.id, userData.token, userData.permissions);
    if (userData.token) {
      this.user.next(loadedUser);
    }
  }

  hasPermission(permission: string): boolean {
    return this.user.getValue() != null && this.user.getValue().permissions.find(p => p == permission) != null;
  }
}
