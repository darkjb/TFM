import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss']
})
export class TournamentFormComponent {
  tournament: TournamentDTO;
  title: FormControl;
  pairing: FormControl;
  tiebreaker: FormControl;

  tournamentForm: FormGroup;
  isValidForm: boolean | null;
  pairings: any[] = [
    {name: "hola", value: 1},
    {name: "adios", value: 2}
  ]

  constructor(
    private formBuilder: FormBuilder,
    private dbChessService: DbChessService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.isValidForm = null;
    this.tournament = new TournamentDTO('', 0, 0);

    this.title = new FormControl(this.tournament.title, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.pairing = new FormControl(this.tournament.pairing, [
      Validators.required
    ]);

    this.tiebreaker = new FormControl(this.tournament.tiebreaker, [
      Validators.required
    ]);

    this.tournamentForm = this.formBuilder.group({
      name: this.title,
      pairing: this.pairing,
      tiebreaker: this.tiebreaker
    });
  }

  getTitleErrorMessage(): string {
    let message = '';

    if (this.title.hasError('required')) {
      message = 'El títol del torneig és obligatori';
    }

    if (this.title.hasError('maxlength')) {
      message = 'El títol no pot tenir més de 30 caràcters';
    }

    return message;
  }

  getPairingErrorMessage(): string {
    let message = '';

    if (this.pairing.hasError('required')) {
      message = "El sistema d'aparellament és obligatori";
    }

    return message;
  }

  getTiebreakerErrorMessage(): string {
    let message = '';

    if (this.tiebreaker.hasError('required')) {
      message = 'El sistema de desempat és obligatori';
    }

    return message;
  }

  async sendForm(): Promise<void> {
    this.tournament = {
      tournamentId: 0,
      title: this.title.value,
      pairing: this.pairing.value.value,
      tiebreaker: this.tiebreaker.value,
      ownerId: 0,
      started: 0,
      finished: 0
    };

    this.tournament.ownerId = parseInt(this.localStorageService.get('user_id')!);
/*
    if (await this.dbChessService.createTournament(this.tournament)) {
      window.alert('Torneig creat correctament =)');
    } else {
      window.alert('Ha fallat alguna cosa, torna a intentar-ho més tard =(');
    }*/
    console.log(this.tournament);
  }

  mostrarDatos(): void {
    console.log(this.tournament);
  }
}
