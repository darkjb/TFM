import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/SinglePage/home/home.component';
import { LoginComponent } from './Components/SinglePage/login/login.component';
import { RegisterComponent } from './Components/SinglePage/register/register.component';
import { TournamentListComponent } from './Components/Tournament/tournament-list/tournament-list.component';
import { FaqsComponent } from './Components/SinglePage/faqs/faqs.component';
import { TournamentFormComponent } from './Components/Tournament/tournament-form/tournament-form.component';
import { TournamentComponent } from './Components/Tournament/tournament-detail/tournament.component';
import { ParticipantListComponent } from './Components/Participant/participant-list/participant-list.component';
import { ParticipantFormComponent } from './Components/Participant/participant-form/participant-form.component';
import { TournamentRankingComponent } from './Components/Tournament/tournament-ranking/tournament-ranking.component';
import { TournamentPairingGeneratorComponent } from './Components/pairing-generator/tournament-pairing-generator.component';
import { TournamentPairingNextComponent } from './Components/tournament-pairing-next/tournament-pairing-next.component';
import { TournamentRoundsListComponent } from './Components/tournament-rounds-list/tournament-rounds-list.component';
import { TournamentRoundsResultFormComponent } from './Components/tournament-rounds-result-form/tournament-rounds-result-form.component';
import { TournamentRoundsDetailComponent } from './Components/tournament-rounds-detail/tournament-rounds-detail.component';
import { TournamentBlogComponent } from './Components/tournament-blog/tournament-blog.component';
import { TournamentBlogCommentFormComponent } from './Components/tournament-blog-comment-form/tournament-blog-comment-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'tournaments',
    component: TournamentListComponent,
  },
  {
    path: 'tournament/:id',
    component: TournamentComponent,
  },
  {
    path: 'tournament/participants/:id',
    component: ParticipantListComponent,
  },
  {
    path: 'tournament/classification/:id',
    component: TournamentRankingComponent,
  },
  {
    path: 'tournament/results/:id',
    component: TournamentRoundsListComponent,
  },
  {
    path: 'tournament/results/:id1/:id2',
    component: TournamentRoundsDetailComponent,
  },
  {
    path: 'tournament/pairing/:id',
    component: TournamentPairingNextComponent,
  },
  {
    path: 'tournament/add_participant/:id',
    component: ParticipantFormComponent,
  },
  {
    path: 'tournament/next_pairing/:id',
    component: TournamentPairingGeneratorComponent,
  },
  {
    path: 'tournament/new_results/:id',
    component: TournamentRoundsResultFormComponent,
  },
  {
    path: 'tournament/blog/:id',
    component: TournamentBlogComponent,
  },
  {
    path: 'tournament/blog/add_comment/:id',
    component: TournamentBlogCommentFormComponent,
  },
  {
    path: 'tournament/blog/edit_comment/:id',
    component: TournamentBlogCommentFormComponent,
  },
  {
    path: 'newTournament',
    component: TournamentFormComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
