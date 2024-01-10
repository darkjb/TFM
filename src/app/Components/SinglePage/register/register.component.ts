import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/Models/user.dto';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: UserDTO;
  name: FormControl;
  surname: FormControl;
  mail: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private dbChessService: DbChessService
  ) {
    this.isValidForm = null;
    this.user = new UserDTO('', '', '', '');

    this.name = new FormControl(this.user.name, [
      Validators.required,
      Validators.maxLength(30),
    ]);

    this.surname = new FormControl(this.user.surname, [
      Validators.required,
      Validators.maxLength(60),
    ]);

    this.mail = new FormControl(this.user.mail, [
      Validators.required,
      Validators.email,
    ]);

    this.password = new FormControl(this.user.password, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]);

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      mail: this.mail,
      password: this.password,
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
      message = 'El cognom no pot tenir més de 60 caràcters';
    }

    return message;
  }

  getMailErrorMessage(): string {
    let message = '';

    if (this.mail.hasError('required')) {
      message = 'El mail és obligatori';
    }

    if (this.mail.hasError('email')) {
      message = 'El correu electrònic no és vàlid';
    }

    return message;
  }

  getPasswordErrorMessage(): string {
    let message = '';

    if (this.mail.hasError('required')) {
      message = 'El password és obligatori';
    }

    if (this.mail.hasError('minlength')) {
      message = 'El password no pot tenir menys de 4 caràcters';
    }

    if (this.mail.hasError('maxlength')) {
      message = 'El password no pot tenir més de 16 caràcters';
    }

    return message;
  }

  async sendForm(): Promise<void> {
    this.user = {
      userId: 0,
      name: this.name.value,
      surname: this.surname.value,
      mail: this.mail.value,
      password: this.password.value,
    };

    try {
      await this.dbChessService.createUser(this.user);
      window.alert('Usuari registrat correctament =)');
    } catch (error: any) {
      window.alert(error.error);
    }
  }
}
