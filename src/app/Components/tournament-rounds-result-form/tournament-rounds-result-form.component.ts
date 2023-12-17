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
    console.log(this.results);
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
        let player1: ParticipantDTO[] = await (this.dbChessService.getParicipantById(this.result.tournamentId, this.result.player1.toString()));
        let player2: ParticipantDTO[] = await (this.dbChessService.getParicipantById(this.result.tournamentId, this.result.player2.toString()));
        if (this.result.result == 'W') {
          player1[0].wins++;
          player2[0].loses++;
        } else if (this.result.result == 'B') {
          player1[0].loses++;
          player2[0].wins++;
        } else {
          player1[0].ties++;
          player2[0].ties++;
        }
        player1[0].white++;
        player2[0].black++;
        await this.dbChessService.updateParticipant(player1[0]);
        await this.dbChessService.updateParticipant(player2[0]);
        await this.checkRoundEnd();
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    } else {
      window.alert(`El resultat d'aquest tauler ja ha estat introduït.`);
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
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  goTournamentDetail(): void {
    this.router.navigateByUrl('/tournament/' + this.activatedRoute.snapshot.paramMap.get('id')!);
  }

  mostrarDatos(): void {
    console.log(this.results);
  }
}
