import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
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
  // showButtons: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
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
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getParticipants(identifier);
    await this.getNexPairing(identifier);
    console.log(this.participants);
    console.log(this.pairing);

    this.showPairing();
    this.fillDataSource();
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
    console.log(this.pairing);
    for (let i: number = 0; i < this.pairing.length; i++) {
      const name1: string = this.participants.find(
        (element) => element.participantId == this.pairing[i].player1
      )!.name;
      const surname1: string = this.participants.find(
        (element) => element.participantId == this.pairing[i].player1
      )!.surname;
      const name2: string = this.participants.find(
        (element) => element.participantId == this.pairing[i].player2
      )!.name;
      const surname2: string = this.participants.find(
        (element) => element.participantId == this.pairing[i].player2
      )!.surname;
      this.whiteNames.push(name1);
      this.blackNames.push(name2);
      this.whiteSurNames.push(surname1);
      this.blackSurNames.push(surname2);
    }
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
    console.log(this.dataSource);
  }
}
