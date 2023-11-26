import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
//  tournaments!: TournamentDTO[];
//  showButtons: boolean;
  constructor(
//    private dbChessService: DbChessService,
//    private localStorageService: LocalStorageService,
//    private sharedService: SharedService,
//    private router: Router,
//    private headerMenusService: HeaderMenusService
  ) {
  //  this.showButtons = false;
  //  this.loadTournaments();
  }

  ngOnInit(): void {
  //  this.headerMenusService.headerManagement.subscribe(
  //    (headerInfo: HeaderMenus) => {
  //      if (headerInfo) {
  //        this.showButtons = headerInfo.showAuthSection;
  //      }
  //    }
  //  );
  }
/*
  private async loadTournaments(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.showButtons = true;
    }
    await this.getTournaments();
  }

  private async getTournaments(): Promise<void> {
    try {
      this.tournaments = await this.dbChessService.getTournaments();
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }*/
}
