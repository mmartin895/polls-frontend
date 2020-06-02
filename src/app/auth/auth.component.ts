import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbAuthService} from '@nebular/auth';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <!--<nb-layout-column>-->
      <nb-card>
        <nb-card-body>
          <nb-auth-block>
            <router-outlet></router-outlet>
          </nb-auth-block>
        </nb-card-body>
      </nb-card>
    <!--</nb-layout-column>-->
  `,
})
export class AuthComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  subscription: any;

  authenticated: boolean = false;
  token: string = '';

  // showcase of how to use the onAuthenticationChange method
  constructor(protected auth: NbAuthService) {

    this.subscription = auth.onAuthenticationChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
