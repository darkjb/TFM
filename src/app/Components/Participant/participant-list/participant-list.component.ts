import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent {
  displayedColumns: string[] = ['participantId', 'name', 'surname', 'elo'];
  participants!: ParticipantDTO[];
  id: number = 0;
 // showButtons: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
   // this.showButtons = false;
    this.loadParticipants();
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

  private async loadParticipants(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
    await this.getParticipants(identifier);
  }

  private async getParticipants(tournamentId: string): Promise<void> {
    try {
      this.participants = await this.dbChessService.getParticipants(tournamentId);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }

    //setTimeout(() => {  console.log("World!"); }, 5000);
  }

  goTournamentDetail(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }
}
