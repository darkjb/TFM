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
//      this.tournaments[i].arbiterName = await this.getName(this.tournaments[i].arbiterId);
//      this.tournaments[i].moderatorName = await this.getName(this.tournaments[i].moderatorId);
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

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
