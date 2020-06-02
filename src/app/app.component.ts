import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router, RouterEvent} from '@angular/router';
import {NbAuthService} from '@nebular/auth';
import {User} from './models/user.model';
import {Subscription} from 'rxjs';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  showHead: boolean = false;

  user: User;
  private userSub: Subscription;

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private userService: UserService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showHead = !event.url.startsWith('/auth');
    }
  }

  ngOnInit() {
    this.userSub = this.userService.user.subscribe(user => {
      this.user = user;
    });
    this.userService.autoLogin();
  }

  logout() {
    this.router.navigate(['/auth/logout']);
    this.authService.logout('email');
    this.userService.logoutUser();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
