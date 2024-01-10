import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Components/SinglePage/register/register.component';
import { LoginComponent } from './Components/SinglePage/login/login.component';
import { HomeComponent } from './Components/SinglePage/home/home.component';
import { TournamentComponent } from './Components/Tournament/tournament-detail/tournament.component';
import { TournamentFormComponent } from './Components/Tournament/tournament-form/tournament-form.component';
import { ParticipantListComponent } from './Components/Participant/participant-list/participant-list.component';
import { ParticipantDetailComponent } from './Components/Participant/participant-detail/participant-detail.component';
import { TournamentBlogComponent } from './Components//tournament-blog/tournament-blog.component';
import { TournamentBlogCommentFormComponent } from './Components//tournament-blog-comment-form/tournament-blog-comment-form.component';
import { TournamentRankingComponent } from './Components/Tournament/tournament-ranking/tournament-ranking.component';
import { TournamentRoundsListComponent } from './Components//tournament-rounds-list/tournament-rounds-list.component';
import { TournamentRoundsDetailComponent } from './Components//tournament-rounds-detail/tournament-rounds-detail.component';
import { TournamentRoundsResultFormComponent } from './Components//tournament-rounds-result-form/tournament-rounds-result-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { HeaderComponent } from './Components/SinglePage/header/header.component';
import { FooterComponent } from './Components/SinglePage/footer/footer.component';
import { TournamentListComponent } from './Components/Tournament/tournament-list/tournament-list.component';
import { FaqsComponent } from './Components/SinglePage/faqs/faqs.component';
import { ParticipantFormComponent } from './Components/Participant/participant-form/participant-form.component';
import { TournamentPairingGeneratorComponent } from './Components/pairing-generator/tournament-pairing-generator.component';
import { TournamentPairingNextComponent } from './Components/tournament-pairing-next/tournament-pairing-next.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    TournamentComponent,
    TournamentFormComponent,
    ParticipantListComponent,
    ParticipantDetailComponent,
    TournamentBlogComponent,
    TournamentBlogCommentFormComponent,
    TournamentRankingComponent,
    TournamentRoundsListComponent,
    TournamentRoundsDetailComponent,
    TournamentRoundsResultFormComponent,
    HeaderComponent,
    FooterComponent,
    TournamentListComponent,
    FaqsComponent,
    ParticipantFormComponent,
    TournamentPairingGeneratorComponent,
    TournamentPairingNextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
