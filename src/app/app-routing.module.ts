import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PollsComponent} from './polls/polls.component';
import {PollsListComponent} from './polls/polls-list/polls-list.component';
import {PollResolverService} from './services/poll-resolver.service';
import {AuthGuard} from './auth/auth.guard';
import {PollsExploreComponent} from './polls/polls-explore/polls-explore.component';
import {QuestionsListComponent} from './questions/questions-list/questions-list.component';


const routes: Routes = [
  {path: '', redirectTo: '/polls/explore', pathMatch: 'full'},
  {
    path: 'polls',
    component: PollsComponent,
    // canActivate: [AuthGuard],
    children: [
      {path: 'list', component: PollsListComponent, canActivate: [AuthGuard], resolve: [PollResolverService]},
      {path: 'explore', component: PollsExploreComponent, resolve: [PollResolverService]},
      {path: 'explore/:id', component: QuestionsListComponent, resolve: [PollResolverService]},
    ]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
