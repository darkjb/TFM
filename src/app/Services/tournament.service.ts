import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TournamentDTO } from '../Models/tournament.dto';
import { UserDTO } from '../Models/user.dto';
import { ParticipantDTO } from '../Models/participant.dto';
import { ResultDTO } from '../Models/result.dto';
import { GameDTO } from '../Models/game.dto.js';
import { CommentDTO } from '../Models/comment.dto';

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

  resultsList(tournamentId: string): Promise<ResultDTO[]> {
    this.controller = 'tournaments/resultsList/';
    return lastValueFrom(
      this.http.get<ResultDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  getResult(
    tournamentId: string,
    roundNumber: string,
    boardNumber: number
  ): Promise<ResultDTO[]> {
    this.controller = 'tournaments/result/';
    return lastValueFrom(
      this.http.get<ResultDTO[]>(
        this.urlServerApi +
          this.controller +
          tournamentId +
          '/' +
          roundNumber +
          '/' +
          boardNumber
      )
    );
  }

  updateResult(result: ResultDTO): Promise<ResultDTO> {
    this.controller = 'reserved/result';
    console.log(this.urlServerApi + this.controller);
    return lastValueFrom(
      this.http.put<ResultDTO>(this.urlServerApi + this.controller, result)
    );
  }

  getLastResults(tournamentId: string): Promise<ResultDTO[]> {
    this.controller = 'tournaments/lastResults/';
    return lastValueFrom(
      this.http.get<ResultDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  getResultsByRoundNumber(
    tournamentId: string,
    roundNumber: string
  ): Promise<GameDTO[]> {
    this.controller = 'tournaments/games/';
    return lastValueFrom(
      this.http.get<GameDTO[]>(
        this.urlServerApi + this.controller + tournamentId + '/' + roundNumber
      )
    );
  }

  setRoundEnded(result: ResultDTO): Promise<void> {
    this.controller = 'reserved/setRoundEnded/';
    return lastValueFrom(
      this.http.patch<void>(this.urlServerApi + this.controller, result)
    );
  }

  setTournamentFinished(tournament: TournamentDTO): Promise<void> {
    this.controller = 'reserved/setTournamentFinished/';
    return lastValueFrom(
      this.http.patch<void>(this.urlServerApi + this.controller, tournament)
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

  getUserName(userId: number): Promise<UserDTO[]> {
    this.controller = 'users/name/';
    return lastValueFrom(
      this.http.get<UserDTO[]>(this.urlServerApi + this.controller + userId)
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

  getParicipantById(
    tournamentId: string,
    participantId: string
  ): Promise<ParticipantDTO[]> {
    this.controller = 'participants/byId/';
    return lastValueFrom(
      this.http.get<ParticipantDTO[]>(
        this.urlServerApi + this.controller + tournamentId + '/' + participantId
      )
    );
  }

  updateParticipant(participant: ParticipantDTO): Promise<ParticipantDTO> {
    this.controller = 'reserved/participant';
    console.log(this.urlServerApi + this.controller);
    return lastValueFrom(
      this.http.put<ParticipantDTO>(
        this.urlServerApi + this.controller,
        participant
      )
    );
  }

  createComment(comment: CommentDTO): Promise<CommentDTO> {
    this.controller = 'reserved/comment';
    return lastValueFrom(
      this.http.post<CommentDTO>(this.urlServerApi + this.controller, comment)
    );
  }

  deleteComment(commentId: number): Promise<deleteResponse> {
    this.controller = 'reserved/comment/';
    return lastValueFrom(
      this.http.delete<deleteResponse>(
        this.urlServerApi + this.controller + commentId
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

  checkRoundEnd(tournamentId: string, roundNumber: string): Promise<number> {
    this.controller = 'tournaments/checkRoundEnd/';
    return lastValueFrom(
      this.http.get<number>(
        this.urlServerApi + this.controller + tournamentId + '/' + roundNumber
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

  getCommentById(commentId: number): Promise<CommentDTO[]> {
    this.controller = 'comments/byCommentId/';
    return lastValueFrom(
      this.http.get<CommentDTO[]>(
        this.urlServerApi + this.controller + commentId
      )
    );
  }

  getCommentsById(tournamentId: string): Promise<CommentDTO[]> {
    this.controller = 'comments/byTournamentId/';
    return lastValueFrom(
      this.http.get<CommentDTO[]>(
        this.urlServerApi + this.controller + tournamentId
      )
    );
  }

  updateComment(comment: CommentDTO): Promise<CommentDTO> {
    this.controller = 'reserved/comment';
    return lastValueFrom(
      this.http.put<CommentDTO>(this.urlServerApi + this.controller, comment)
    );
  }
}
