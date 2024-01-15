import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDTO } from 'src/app/Models/game.dto.js';
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
  id1: number = 0;
  id2: number = 0;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    const identifier1 = this.activatedRoute.snapshot.paramMap.get('id1')!;
    const identifier2 = this.activatedRoute.snapshot.paramMap.get('id2')!;
    this.id1 = parseInt(identifier1);
    this.id2 = parseInt(identifier2);
    await this.getGames(identifier1, identifier2);
  }

  private async getGames(
    tournamentId: string,
    roundNumber: string
  ): Promise<void> {
    try {
      this.games = await this.dbChessService.getResultsByRoundNumber(
        tournamentId,
        roundNumber
      );
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  evaluateResult(res: string): number[] {
    let r1: number = 0;
    let r2: number = 0;
    if (res == 'W') {
      r1 = 1;
    }
    if (res == 'B') {
      r2 = 1;
    }
    if (res == 'X') {
      r1 = 1 / 2;
      r2 = 1 / 2;
    }
    return [r1, r2];
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
