import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-ranking',
  templateUrl: './tournament-ranking.component.html',
  styleUrls: ['./tournament-ranking.component.scss'],
})
export class TournamentRankingComponent {
  displayedColumns: string[] = [
    'participantPosition',
    'name',
    'surname',
    'elo',
    'points',
  ];
  participants!: ParticipantDTO[];
  id: number = 0;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadParticipants();
  }

  private async loadParticipants(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getParticipants(identifier);
    this.ranking();
  }

  private async getParticipants(tournamentId: string): Promise<void> {
    try {
      this.participants = await this.dbChessService.getParticipants(
        tournamentId
      );
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  private ranking(): void {
    this.participants.sort(function (a: ParticipantDTO, b: ParticipantDTO) {
      const aPoints: number = 2 * a.wins + a.ties;
      const bPoints: number = 2 * b.wins + b.ties;
      return bPoints - aPoints;
    });
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
