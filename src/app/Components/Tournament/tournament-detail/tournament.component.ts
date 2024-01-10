import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss'],
})
export class TournamentComponent {
  tournament!: TournamentDTO;
  permission: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.permission = false;
    this.loadTournament();
  }

  private async loadTournament(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    try {
      const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
      const list = await this.dbChessService.getTournamentById(identifier);
      this.tournament = list[0];
      if (userId) {
        this.permission = parseInt(userId) == this.tournament.ownerId;
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }

    await this.getNames(this.tournament.ownerId);
  }

  private async getNames(id: number): Promise<void> {
    this.tournament.ownerName = await this.getName(id);
    this.tournament.pairingName = this.getPairing(this.tournament.pairing);
    this.tournament.tiebreakerName = this.getTiebreaker(
      this.tournament.tiebreaker
    );
    this.tournament.status = this.getStatus(this.tournament);
  }

  private async getName(id: number): Promise<string> {
    let name = '';
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
      pairing = 'Round Robin';
    }
    return pairing;
  }

  private getTiebreaker(t: number): string {
    let tiebreaker: string = '';
    if (t === 1) {
      tiebreaker = 'Buchholz';
    } else if (t === 2) {
      tiebreaker = 'Sonneborn-Berger';
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

  goBlogPage(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/blog/' + tournamentId.toString());
  }

  goParticipantsList(tournamentId: number): void {
    this.router.navigateByUrl(
      '/tournament/participants/' + tournamentId.toString()
    );
  }

  goClassification(tournamentId: number): void {
    this.router.navigateByUrl(
      '/tournament/classification/' + tournamentId.toString()
    );
  }

  goOldResults(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/results/' + tournamentId.toString());
  }

  goNextPairing(tournamentId: number): void {
    this.router.navigateByUrl('/tournament/pairing/' + tournamentId.toString());
  }

  goAddParticipant(tournamentId: number): void {
    this.router.navigateByUrl(
      '/tournament/add_participant/' + tournamentId.toString()
    );
  }

  goNewPairing(tournamentId: number): void {
    this.router.navigateByUrl(
      '/tournament/next_pairing/' + tournamentId.toString()
    );
  }

  goEnterResults(tournamentId: number): void {
    this.router.navigateByUrl(
      '/tournament/new_results/' + tournamentId.toString()
    );
  }
}
