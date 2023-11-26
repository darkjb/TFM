import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent {
  participant: ParticipantDTO;
  name: FormControl;
  surname: FormControl;
  elo: FormControl;

  participantForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.isValidForm = null;
    this.participant = new ParticipantDTO(0, '', '', 0);

    this.name = new FormControl(this.participant.name, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.surname = new FormControl(this.participant.surname, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.elo = new FormControl(this.participant.elo, [
      Validators.required,
      Validators.pattern("[0-9]+"),
    ]);

    this.participantForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      elo: this.elo
    });
  }

  getNameErrorMessage(): string {
    let message = '';

    if (this.name.hasError('required')) {
      message = 'El nom és obligatori';
    }

    if (this.name.hasError('maxlength')) {
      message = 'El nom no pot tenir més de 30 caràcters';
    }

    return message;
  }

  getSurnameErrorMessage(): string {
    let message = '';

    if (this.surname.hasError('required')) {
      message = 'El cognom és obligatori';
    }

    if (this.surname.hasError('maxlength')) {
      message = 'El cognom no pot tenir més de 30 caràcters';
    }

    return message;
  }

  getEloErrorMessage(): string {
    let message = '';

    if (this.elo.hasError('required')) {
      message = "El elo és obligatori. Si no en té, indica 0.";
    }

    if (this.elo.hasError('pattern')) {
      message = "El elo ha de ser numèric";
    }

    return message;
  }

  async sendForm(): Promise<void> {
    this.participant = {
      participantId: 0,
      tournamentId: parseInt(this.activatedRoute.snapshot.paramMap.get('id')!),
      name: this.name.value,
      surname: this.surname.value,
      elo: this.elo.value,
      wins: 0,
      ties: 0,
      loses: 0,
      white: 0,
      black: 0,
      last: ''
    };


    if (await this.dbChessService.createParticipant(this.participant)) {
      window.alert('Participant afegit correctament =)');
    } else {
      window.alert('Ha fallat alguna cosa, torna a intentar-ho més tard =(');
    }
  }

  mostrarDatos(): void {
    console.log(this.participant);
  }
}
