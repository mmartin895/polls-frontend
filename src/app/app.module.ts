import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PollsComponent } from './polls/polls.component';
import { PollsListComponent } from './polls/polls-list/polls-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionsListComponent } from './questions/questions-list/questions-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbRadioModule,
  NbCheckboxModule,
  NbSelectModule,
  NbToggleModule,
  NbIconModule,
  NbToastrModule,
  NbContextMenuModule,
  NbMenuModule,
  NbTabsetModule,
  NbActionsModule, NbAccordionModule, NbPopoverModule, NbDialogModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PollEditComponent } from './polls/poll-edit/poll-edit.component';
import {TagInputModule} from 'ngx-chips';
import {NbAuthModule, NbAuthSimpleToken, NbPasswordAuthStrategy} from '@nebular/auth';
import {environment} from '../environments/environment';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import { PollsExploreComponent } from './polls/polls-explore/polls-explore.component';
import { PollItemComponent } from './polls/poll-item/poll-item.component';
import { PollsSubmittedComponent } from './polls/polls-submitted/polls-submitted.component';
import {ClipboardModule} from 'ngx-clipboard';
import { PollFavouriteComponent } from './polls/poll-favourite/poll-favourite.component';
import { PollArchivedComponent } from './polls/poll-archived/poll-archived.component';
import { YesNoDialogComponent } from './yesno-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PollsComponent,
    PollsListComponent,
    QuestionsComponent,
    QuestionsListComponent,
    PollEditComponent,
    PollsExploreComponent,
    PollItemComponent,
    PollsSubmittedComponent,
    PollFavouriteComponent,
    PollArchivedComponent,
    YesNoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TagInputModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          token: {
            class: NbAuthSimpleToken,
            key: 'key', // this parameter tells where to look for the token
          },
          baseEndpoint: environment.apiBaseUrl,
          login: {
            endpoint: '/auth/login/',
            method: 'post'
          },
          register: {
            endpoint: '/auth/registration/',
            method: 'post'
          },
          logout: {
            endpoint: '/auth/logout/',
            method: 'post'
          },
        }),
      ],
      forms: {},
    }),
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbRadioModule,
    NbCheckboxModule,
    NbSelectModule,
    NbToggleModule,
    NbIconModule,
    NbPopoverModule,
    NbToastrModule.forRoot(),
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbTabsetModule,
    NbActionsModule,
    NbAccordionModule,
    ClipboardModule,
    NbDialogModule.forRoot(),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// voja was here
