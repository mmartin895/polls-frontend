import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PollsComponent} from './polls/polls.component';
import {PollsListComponent} from './polls/polls-list/polls-list.component';
import {PollResolverService} from './services/poll-resolver.service';
import {AuthGuard} from './auth/auth.guard';
import {PermissionGuard} from './auth/permission-guard';
import {PollsExploreComponent} from './polls/polls-explore/polls-explore.component';
import {QuestionsListComponent} from './questions/questions-list/questions-list.component';
import {PollFavouriteComponent} from './polls/poll-favourite/poll-favourite.component';
import {PollArchivedComponent} from './polls/poll-archived/poll-archived.component';
import { ARCHIVE_MANAGEMENT_PERMISSION } from './services/user.service';


const routes: Routes = [
  {path: '', redirectTo: '/polls/explore', pathMatch: 'full'},
  {
    path: 'polls',
    component: PollsComponent,
    // canActivate: [AuthGuard],
    children: [
      {path: 'list', component: PollsListComponent, canActivate: [AuthGuard], resolve: [PollResolverService]},
      {path: 'favourite', component: PollFavouriteComponent, canActivate: [AuthGuard]},
      { path: 'archived', 
        component: PollArchivedComponent, 
        canActivate: [PermissionGuard], 
        data: 
          { permissions: [ARCHIVE_MANAGEMENT_PERMISSION] }
      },
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
