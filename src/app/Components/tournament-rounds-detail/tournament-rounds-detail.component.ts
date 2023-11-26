import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDTO } from 'src/app/Models/game.dto.js';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-rounds-detail',
  templateUrl: './tournament-rounds-detail.component.html',
  styleUrls: ['./tournament-rounds-detail.component.scss'],
})
export class TournamentRoundsDetailComponent {
  displayedColumns: string[] = [
    'boardNumber',
    'player1',
    'result1',
    'player2',
    'result2',
  ];
  games!: GameDTO[];
  id: number = 0;
  // showButtons: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    // this.showButtons = false;
    this.loadData();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          // this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private async loadData(): Promise<void> {
    const identifier1 = this.activatedRoute.snapshot.paramMap.get('id1')!;
    const identifier2 = this.activatedRoute.snapshot.paramMap.get('id2')!;
    this.id = parseInt(identifier2);
    await this.getGames(identifier1, identifier2);
  }

  private async getGames(tournamentId: string, roundNumber: string): Promise<void> {
    try {
      this.games = await this.dbChessService.getResultsByRoundNumber(tournamentId, roundNumber);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }

    //setTimeout(() => {  console.log("World!"); }, 5000);
  }

  evaluateResult (res: string): number[] {
    let r1: number = 0;
    let r2: number = 0;
    if (res == 'W') {
      r1 = 1;
    }
    if (res == 'B') {
      r2 = 1;
    }
    if (res == 'X') {
      r1 = 1/2;
      r2 = 1/2;
    }
    return [r1, r2];
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
