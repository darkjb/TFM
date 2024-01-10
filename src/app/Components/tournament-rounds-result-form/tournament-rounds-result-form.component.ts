import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-rounds-result-form',
  templateUrl: './tournament-rounds-result-form.component.html',
  styleUrls: ['./tournament-rounds-result-form.component.scss'],
})
export class TournamentRoundsResultFormComponent {
  result: ResultDTO;
  results!: ResultDTO[];
  finished: boolean = false;
  board: FormControl;
  score: FormControl;
  boardNumbers: number[] = [];
  scoreOptions: string[] = ['Guanyen Blanques', 'Guanyen Negres', 'Taules'];

  resultForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private dbChessService: DbChessService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.getResults();
    this.isValidForm = null;
    this.result = new ResultDTO('', '', 0);

    this.board = new FormControl(this.result.boardNumber, Validators.required);

    this.score = new FormControl(this.result.result, Validators.required);

    this.resultForm = this.formBuilder.group({
      name: this.board,
      surname: this.score,
    });
  }

  private async getResults(): Promise<void> {
    try {
      this.results = await this.dbChessService.getLastResults(
        this.activatedRoute.snapshot.paramMap.get('id')!
      );
      this.results.forEach((res) => this.boardNumbers.push(res.boardNumber));
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  getBoardErrorMessage(): string {
    let message = '';

    if (this.board.hasError('required')) {
      message = 'És obligatori indicar el Taulell de Joc.';
    }

    return message;
  }

  getScoreErrorMessage(): string {
    let message = '';

    if (this.board.hasError('required')) {
      message = 'És obligatori indicar el Resultat de la Partida.';
    }

    return message;
  }

  async sendForm(): Promise<void> {
    this.result = {
      tournamentId: this.results[0].tournamentId,
      roundNumber: this.results[0].roundNumber,
      boardNumber: this.board.value,
      roundEnded: 0,
      player1: 0,
      player2: 0,
      result: this.score.value,
    };

    this.transformResult();

    console.log(this.result.tournamentId);
    console.log(this.result.roundNumber);
    console.log(this.result.boardNumber);

    const res = await this.dbChessService.getResult(
      this.result.tournamentId,
      this.result.roundNumber,
      this.result.boardNumber
    );

    if (res[0].result == '') {
      try {
        await this.dbChessService.updateResult(this.result);
        console.log(this.result);
        this.result = (
          await this.dbChessService.getResult(
            this.result.tournamentId,
            this.result.roundNumber,
            this.result.boardNumber
          )
        )[0];
        console.log(this.result);
        let player1: ParticipantDTO[] =
          await this.dbChessService.getParicipantById(
            this.result.tournamentId,
            this.result.player1.toString()
          );
        let player2: ParticipantDTO[] =
          await this.dbChessService.getParicipantById(
            this.result.tournamentId,
            this.result.player2.toString()
          );
        this.countResult(player1[0], player2[0]);
        await this.dbChessService.updateParticipant(player1[0]);
        await this.dbChessService.updateParticipant(player2[0]);
        window.alert('Resultat introduït correctament!');
        await this.checkRoundEnd();
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    } else {
      this.showAlert(res[0].result);
    }
  }

  private countResult(p1: ParticipantDTO, p2: ParticipantDTO): void {
    if (this.result.result == 'W') {
      p1.wins++;
      p2.loses++;
    } else if (this.result.result == 'B') {
      p1.loses++;
      p2.wins++;
    } else {
      p1.ties++;
      p2.ties++;
    }
  }

  private showAlert(res: string): void {
    if (res === 'W') {
      window.alert(
        `El resultat d'aquest tauler ja ha estat introduït, han guanyat les Blanques`
      );
    } else if (res === 'B') {
      window.alert(
        `El resultat d'aquest tauler ja ha estat introduït, han guanyat les Negres`
      );
    } else {
      window.alert(
        `El resultat d'aquest tauler ja ha estat introduït, han sigut Taules`
      );
    }
  }

  private transformResult(): void {
    if (this.result.result == 'Guanyen Blanques') this.result.result = 'W';
    if (this.result.result == 'Guanyen Negres') this.result.result = 'B';
    if (this.result.result == 'Taules') this.result.result = 'X';
  }

  private async checkRoundEnd(): Promise<void> {
    if (
      (await this.dbChessService.checkRoundEnd(
        this.result.tournamentId,
        this.result.roundNumber
      )) == 0
    ) {
      try {
        await this.dbChessService.setRoundEnded(this.result);
        window.alert('La Ronda ha Finalitzat!');
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
      await this.checkTournamentEnd();
    }
  }

  private async checkTournamentEnd(): Promise<void> {
    const tournament: TournamentDTO = (
      await this.dbChessService.getTournamentById(this.result.tournamentId)
    )[0];
    let n: number = await this.dbChessService.getNumberOfParticipants(
      tournament.tournamentId
    );
    let finalRound: number;
    if (tournament.pairing === 1) {
      finalRound = Math.ceil(Math.log2(n));
    } else {
      if (n % 2 === 0) {
        finalRound = n - 1;
      } else {
        finalRound = n;
      }
    }
    await this.endTournament(finalRound, tournament);
    window.alert('El Torneig ha Finalitzat!');
  }

  private async endTournament(
    finalRound: number,
    tournament: TournamentDTO
  ): Promise<void> {
    if (this.result.roundNumber == finalRound.toString()) {
      try {
        await this.dbChessService.setTournamentFinished(tournament);
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  goTournamentDetail(): void {
    this.router.navigateByUrl(
      '/tournament/' + this.activatedRoute.snapshot.paramMap.get('id')!
    );
  }
}
