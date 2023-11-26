import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TournamentDTO } from '../Models/tournament.dto';
import { UserDTO } from '../Models/user.dto';
import { ParticipantDTO } from '../Models/participant.dto';
import { ResultDTO } from '../Models/result.dto';
import { GameDTO } from '../Models/game.dto.js';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class DbChessService {
  private urlServerApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = '';
    this.urlServerApi = 'http://localhost:3000/' + this.controller;
  }

  getTournaments(): Promise<TournamentDTO[]> {
    this.controller = 'tournaments';
    return lastValueFrom(
      this.http.get<TournamentDTO[]>(this.urlServerApi + this.controller)
    );
  }

  getTournamentsByUserId(userId: number): Promise<TournamentDTO[]> {
    return lastValueFrom(
      this.http.get<TournamentDTO[]>(
        'http://localhost:3000/users/tournaments/' + userId
      )
    );
  }

  createUser(user: UserDTO): Promise<UserDTO> {
    this.controller = 'users';
    return lastValueFrom(
      this.http.post<UserDTO>(this.urlServerApi + this.controller, user)
    );
  }

  getResults(tournamentId: string): Promise<ResultDTO[]> {
    this.controller = 'tournaments/results/';
    return lastValueFrom(
      this.http.get<ResultDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  getResultsByRoundNumber(tournamentId: string, roundNumber: string): Promise<GameDTO[]> {
    this.controller = 'tournaments/games/';
    return lastValueFrom(
      this.http.get<GameDTO[]>(
        this.urlServerApi + this.controller + tournamentId + '/' + roundNumber
      )
    );
  }

  getNexPairing(tournamentId: number): Promise<ResultDTO[]> {
    this.controller = 'tournaments/pairing/next/';
    return lastValueFrom(
      this.http.get<ResultDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  createResult(result: ResultDTO): Promise<ResultDTO> {
    this.controller = 'reserved/result';
    return lastValueFrom(
      this.http.post<ResultDTO>(this.urlServerApi + this.controller, result)
    );
  }

  getNumberOfParticipants(tournamentId: number): Promise<number> {
    this.controller = 'participants/numberOf/';
    return lastValueFrom(
      this.http.get<number>(this.urlServerApi + this.controller + tournamentId)
    );
  }
  /*CreateTournament(tournament: TournamentDTO): Promise<TournamentDTO> {
    this.controller = 'tournaments';
    return lastValueFrom(
      this.http.post<TournamentDTO>(this.urlServerApi + this.controller, tournament)
    );
  }*/

  getUserLogin(user: UserDTO): Promise<any> {
    this.controller = 'users/auth';
    return lastValueFrom(
      this.http.post<any>(this.urlServerApi + this.controller, user)
    );
  }

  createTournament(post: TournamentDTO): Promise<TournamentDTO> {
    this.controller = 'reserved/tournament';
    return lastValueFrom(
      this.http.post<TournamentDTO>(this.urlServerApi + this.controller, post)
    );
  }

  createParticipant(participant: ParticipantDTO): Promise<ParticipantDTO> {
    this.controller = 'reserved/participant';
    return lastValueFrom(
      this.http.post<ParticipantDTO>(
        this.urlServerApi + this.controller,
        participant
      )
    );
  }

  getTournamentById(tournamentId: string): Promise<TournamentDTO[]> {
    this.controller = 'tournaments/byTournamentId/';
    return lastValueFrom(
      this.http.get<TournamentDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  updateTournament(tournament: TournamentDTO): Promise<TournamentDTO> {
    this.controller = 'reserved/tournament';
    console.log(this.urlServerApi + this.controller);
    return lastValueFrom(
      this.http.put<TournamentDTO>(
        this.urlServerApi + this.controller,
        tournament
      )
    );
  }

  deleteTournament(tournamentId: string): Promise<deleteResponse> {
    return lastValueFrom(
      this.http.delete<deleteResponse>(this.urlServerApi + '/' + tournamentId)
    );
  }

  getParticipants(tournamentId: string): Promise<ParticipantDTO[]> {
    this.controller = 'participants/byTournamentId/';
    return lastValueFrom(
      this.http.get<ParticipantDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }
}