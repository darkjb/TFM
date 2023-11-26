import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss'],
})
export class TournamentComponent {
  tournament!: TournamentDTO;
  permission: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.permission = false;
    this.loadTournament();
  }
  
  private async loadTournament(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
    //  this.showButtons = true;
    }
    try {
      const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
      const list = await this.dbChessService.getTournamentById(identifier);
      this.tournament = list[0];
      if(this.localStorageService.get('user_id')) {
        this.permission = parseInt(this.localStorageService.get('user_id')!) == this.tournament.ownerId;
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  goParticipantsList(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/participants/' + tournamentId.toString());
  }

  goClassification(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/classification/' + tournamentId.toString());
  }

  goOldResults(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/results/' + tournamentId.toString());
  }

  goNextPairing(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/pairing/' + tournamentId.toString());
  }

  goAddParticipant(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/add_participant/' + tournamentId.toString());
  }

  goNewPairing(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/next_pairing/' + tournamentId.toString());
  }

  goEnterResults(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/new_results/' + tournamentId.toString());
  }
}
