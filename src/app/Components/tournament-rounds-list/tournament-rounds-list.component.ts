import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultDTO } from 'src/app/Models/result.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-rounds-list',
  templateUrl: './tournament-rounds-list.component.html',
  styleUrls: ['./tournament-rounds-list.component.scss'],
})
export class TournamentRoundsListComponent {
  results!: ResultDTO[];
  id: number = 0;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.loadResults();
  }

  ngOnInit(): void {}

  private async loadResults(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getResults(identifier);
  }

  private async getResults(tournamentId: string): Promise<void> {
    try {
      this.results = await this.dbChessService.resultsList(tournamentId);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  goResultDetail(tournamentId: string, roundNumber: string): void {
    this.router.navigateByUrl(
      '/tournament/results/' + tournamentId + '/' + roundNumber
    );
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
