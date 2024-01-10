import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent {
  displayedColumns: string[] = ['participantId', 'name', 'surname', 'elo'];
  participants!: ParticipantDTO[];
  id: number = 0;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.loadParticipants();
  }

  ngOnInit(): void {}

  private async loadParticipants(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getParticipants(identifier);
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

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
