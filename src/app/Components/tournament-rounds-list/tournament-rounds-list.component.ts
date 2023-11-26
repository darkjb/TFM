import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-rounds-list',
  templateUrl: './tournament-rounds-list.component.html',
  styleUrls: ['./tournament-rounds-list.component.scss']
})
export class TournamentRoundsListComponent {

  results!: ResultDTO[];
  id: number = 0;
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
    this.loadResults();
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

  private async loadResults(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getResults(identifier);
  }

  private async getResults(tournamentId: string): Promise<void> {
    try {
      this.results = await this.dbChessService.getResults(tournamentId);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }

    //setTimeout(() => {  console.log("World!"); }, 5000);
  }

  goResultDetail(tournamentId: string, roundNumber: string): void {
    this.router.navigateByUrl('/tournament/results/' + tournamentId + '/' + roundNumber);
  }
}
