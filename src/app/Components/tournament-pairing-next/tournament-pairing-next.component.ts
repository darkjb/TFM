import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-pairing-next',
  templateUrl: './tournament-pairing-next.component.html',
  styleUrls: ['./tournament-pairing-next.component.scss'],
})
export class TournamentPairingNextComponent {
  displayedColumns: string[] = [
    'boardNumber',
    'name1',
    'surname1',
    'vs',
    'name2',
    'surname2',
  ];
  participants!: ParticipantDTO[];
  pairing!: ResultDTO[];
  whiteNames: String[] = [];
  whiteSurNames: String[] = [];
  blackNames: String[] = [];
  blackSurNames: String[] = [];
  id: number = 0;
  dataSource: any[] = [];
  started: boolean = false;
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
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getParticipants(identifier);
    await this.getNexPairing(identifier);

    if (this.pairing.length > 0) {
      this.showPairing();
      this.fillDataSource();
      this.started = true;
    } else {
      this.started = false;
    }
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

  private async getNexPairing(tournamentId: string): Promise<void> {
    try {
      this.pairing = await this.dbChessService.getNexPairing(
        parseInt(tournamentId)
      );
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  private showPairing(): void {
    for (let i: number = 0; i < this.pairing.length; i++) {
      let name1: string = 'BYE';
      let name2: string = 'BYE';
      let surname1: string = '';
      let surname2: string = '';
      if (this.pairing[i].player1 !== 0) {
        name1 = this.getName1(i);
        surname1 = this.getSurname1(i);
      }
      if (this.pairing[i].player2 !== 0) {
        name2 = this.getName2(i);
        surname2 = this.getSurname2(i);
      }
      this.whiteNames.push(name1);
      this.blackNames.push(name2);
      this.whiteSurNames.push(surname1);
      this.blackSurNames.push(surname2);
    }
  }

  private getName1(n: number): string {
    return this.participants.find(
      (element) => element.participantId == this.pairing[n].player1
    )!.name;
  }

  private getSurname1(n: number): string {
    return this.participants.find(
      (element) => element.participantId == this.pairing[n].player1
    )!.surname;
  }

  private getName2(n: number): string {
    return this.participants.find(
      (element) => element.participantId == this.pairing[n].player2
    )!.name;
  }

  private getSurname2(n: number): string {
    return this.participants.find(
      (element) => element.participantId == this.pairing[n].player2
    )!.surname;
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }

  private fillDataSource(): void {
    for (let i: number = 0; i < this.pairing.length; i++) {
      this.dataSource.push({
        boardNumber: this.pairing[i].boardNumber,
        name1: this.whiteNames[i],
        surname1: this.whiteSurNames[i],
        name2: this.blackNames[i],
        surname2: this.blackSurNames[i],
      });
    }
  }
}
