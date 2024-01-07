import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
})
export class TournamentListComponent {
  tournaments!: TournamentDTO[];
 // showButtons: boolean;
  constructor(
    private dbChessService: DbChessService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
   // this.showButtons = false;
    this.loadTournaments();
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

  private async loadTournaments(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
    //  this.showButtons = true;
    }
    await this.getTournaments();
    await this.getNames();
  }

  private async getTournaments(): Promise<void> {
    try {
      this.tournaments = await this.dbChessService.getTournaments();
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }

    //setTimeout(() => {  console.log("World!"); }, 5000);
  }

  private async getNames(): Promise<void> {
    for(let i = 0; i < this.tournaments.length; i++) {
      this.tournaments[i].ownerName = await this.getName(this.tournaments[i].ownerId);
      this.tournaments[i].pairingName = this.getPairing(this.tournaments[i].pairing);
      this.tournaments[i].tiebreakerName = this.getTiebreaker(this.tournaments[i].tiebreaker);
      this.tournaments[i].status = this.getStatus(this.tournaments[i]);
    }
  }

  private async getName(id: number): Promise<string>  {
    let name = "";
    if (id > 0) {
      try {
        const users: UserDTO[] = await this.dbChessService.getUserName(id);
        if (users.length > 0) {
          name = users[0].name + ' ' + users[0].surname;
        }
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
    return name;
  }

  private getPairing(p: number): string {
    let pairing: string = '';
    if (p === 1) {
      pairing = 'Sistema Suís';
    } else if (p === 2) {
      pairing = 'Round Robin'
    }
    return pairing;
  }

  private getTiebreaker(t: number): string {
    let tiebreaker: string = '';
    if (t === 1) {
      tiebreaker = 'Buchholz';
    } else if (t === 2) {
      tiebreaker = 'Sonneborn-Berger'
    }
    return tiebreaker;
  }

  private getStatus(tournament: TournamentDTO): string {
    let status: string = '';
    if (tournament.started === 0) {
      status = 'Torneig no començat';
    } else {
      status = 'Torneig en marxa';
    }
    if (tournament.finished === 1) {
      status = 'Torneig finalitzat';
    }
    return status;
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
