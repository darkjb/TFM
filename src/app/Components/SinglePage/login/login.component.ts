import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginUser: AuthDTO;
  mail: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  isValidForm: boolean | null;

  private responseOK: boolean;
  private errorResponse: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.isValidForm = null;
    this.responseOK = false;
    this.loginUser = new AuthDTO('', '', '', '');

    this.mail = new FormControl('', [Validators.required, Validators.email]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      mail: this.mail,
      password: this.password,
    });
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

    if (this.password.hasError('required')) {
      message = 'El password és obligatori';
    }

    if (this.password.hasError('minlength')) {
      message = 'El password ha de ser al menys de 4 caracters';
    }

    if (this.password.hasError('maxlength')) {
      message = 'El password ha de ser com a molt de 16 caracters';
    }

    return message;
  }

  async login(): Promise<void> {
    this.responseOK = false;

    this.loginUser.email = this.mail.value;
    this.loginUser.password = this.password.value;

    await this.doLogin();

    await this.sharedService.managementToast(
      'loginFeedback',
      this.responseOK,
      this.errorResponse
    );

    if (this.responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
      };
      // update options menu
      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigateByUrl('home');
    }
  }

  private async doLogin(): Promise<void> {
    try {
      const authToken = await this.authService.login(this.loginUser);
      this.responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;
      // save token to localstorage for next requests
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token);
    } catch (error: any) {
      this.responseOK = false;
      this.errorResponse = error.error;
      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      window.alert('Combinació usuari/contrasenya incorrecta =S');
      this.sharedService.errorLog(error.error);
    }
  }
}
