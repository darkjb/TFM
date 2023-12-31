import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDTO } from '../Models/auth.dto';
import { lastValueFrom } from 'rxjs';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlServerApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users/auth';
    this.urlServerApi = 'http://localhost:3000/' + this.controller;
  }

  login(auth: AuthDTO): Promise<AuthToken> {
    return lastValueFrom(
      this.http.post<AuthToken>(this.urlServerApi, auth)
    );
  }
}
