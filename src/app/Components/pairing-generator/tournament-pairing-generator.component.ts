import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDTO } from 'src/app/Models/game.dto.js';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ParticipantDTO } from 'src/app/Models/participant.dto';
import { PlayerDTO } from 'src/app/Models/player.dto';
import { ResultDTO } from 'src/app/Models/result.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-pairing-generator',
  templateUrl: './tournament-pairing-generator.component.html',
  styleUrls: ['./tournament-pairing-generator.component.scss'],
})
export class TournamentPairingGeneratorComponent implements OnInit {
  id: number = 0;
  pairing: ResultDTO[] = [];
  results!: ResultDTO[];
  players!: ParticipantDTO[];
  tournament!: TournamentDTO;
  newTournament!: boolean;
  numPlayers!: number;
  haveBye!: boolean;
  finished: boolean = true;
  tournamentStarted: boolean;
  bergerTable: number[][] = [];

  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.getId();
    this.tournamentStarted = false;
  }

  async ngOnInit(): Promise<void> {
    await this.getTournamentData();
    this.newTournament = !this.tournament.started;
    this.tournamentStarted = this.tournament.started === 1;
    this.finished = this.tournament.finished === 1;
  }

  private async getId(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.id = parseInt(identifier);
  }

  private async getTournamentData(): Promise<void> {
    const tournaments: TournamentDTO[] =
      await this.dbChessService.getTournamentById(this.id.toString());
    this.tournament = tournaments[0];
  }

  async doPairing(): Promise<void> {
    //Recuperem dades i generem l'aparellament
    await this.getParticipants();
    await this.getResults();

    let playersArray: number[] = [];
    this.players.forEach((player) => {
      playersArray.push(player.participantId);
    });

    this.bergerTable = this.generateBergerTable(playersArray);

    // Imprimir la taula Berger
    //    console.log('Taula Berger:');
    //    for (const row of this.bergerTable) {
    //      console.log(row);
    //    }

    if (this.results.length > 0) {
      const pendingRound = this.lastRoundPending();
      if (pendingRound !== 0) {
        window.alert('La Ronda ' + pendingRound + ' no ha finalitzat');
      } else {
        this.doNextPairing(
          parseInt(this.results[this.results.length - 1].roundNumber) + 1
        );
        window.alert('Aparellament creat correctament =)');
        //  this.goNextPairing(this.id);
      }
    } else {
      this.doFirstPairing();
      window.alert('Aparellament creat correctament =)');
      this.goNextPairing(this.id);
    }
  }

  private async setTournamentStarted() {
    this.tournament.started = 1;
    try {
      await this.dbChessService.updateTournament(this.tournament);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    this.tournamentStarted = true;
  }

  private async getParticipants(): Promise<void> {
    //Recuperem els participants del torneig
    try {
      this.players = await this.dbChessService.getParticipants(
        this.id.toString()
      );
      this.numPlayers = this.players.length;
      if (!(this.numPlayers % 2 === 0)) {
        // Si tenim un nombre imparell de participants, generem el participant fictici BYE
        this.players.push(new ParticipantDTO(this.id, 'Bye', '', 0));
        this.numPlayers++;
        this.haveBye = true;
      }
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    console.log(this.players);
  }

  private async getResults(): Promise<void> {
    //Recuperem els resultats del torneig fins al moment
    if (this.newTournament) {
      this.results = [];
    } else {
      try {
        this.results = await this.dbChessService.getResults(this.id.toString());
        console.log(this.results);
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }
  private async doFirstPairing(): Promise<void> {
    //Funció que genera el primer aparellament
    for (let i: number = 0; i < this.numPlayers / 2; i++) {
      let pair: ResultDTO = new ResultDTO(this.id.toString(), '1', i + 1);
      pair.player1 = this.players[i].participantId;
      pair.player2 = this.players[this.players.length - i - 1].participantId;
      this.pairing.push(pair);
    }

    await this.setTournamentStarted();
    this.pairing.forEach(async (result) => {
      await this.createResults(result);
    });
  }

  private doNextPairing(round: number): void {
    //Funció que genera els aparellaments del segon en endavant

    if (this.tournament.pairing === 1) {
      this.doSwissPairing(round);
    } else if (this.tournament.pairing === 2) {
      this.doRobinsonPairing(round);
    }

    this.pairing.forEach(async (result) => {
      await this.createResults(result);
    });
  }

  private async doRobinsonPairing(round: number): Promise<void> {
    const p = this.bergerTable[round - 1];

    for (let i = 0; i < this.players.length; i += 2) {
      let pair: ResultDTO = new ResultDTO(
        this.id.toString(),
        round.toString(),
        1
      );
      pair.boardNumber = i / 2 + 1;
      pair.player1 = p[i];
      pair.player2 = p[i + 1];

      if (pair.player1 === 0) {
        pair.result = 'B';
        let player: ParticipantDTO[] =
          await this.dbChessService.getParicipantById(
            this.id.toString(),
            pair.player2.toString()
          );
        player[0].wins++;
        await this.dbChessService.updateParticipant(player[0]);
      }

      if (pair.player2 === 0) {
        pair.result = 'W';
        let player: ParticipantDTO[] =
          await this.dbChessService.getParicipantById(
            this.id.toString(),
            pair.player1.toString()
          );
        player[0].wins++;
        await this.dbChessService.updateParticipant(player[0]);
      }

      this.createResults(pair);
    }
  }

  private getPlayerGroups(nGroups: number): ParticipantDTO[][] {
    //Funció per dividir els participants segons la puntuació que porten al torneig
    let groups: ParticipantDTO[][] = new Array<ParticipantDTO[]>(nGroups);

    for (let i: number = 0; i < nGroups; i++) {
      groups[i] = this.players.filter(
        (player) => player.wins + 2 * player.ties === i
      );
    }

    return groups;
  }

  private getPlayerPlayedGroups(): ParticipantDTO[][] {
    //Generem els grups de participants que ja han jugat contra cada participant
    let pGroups: ParticipantDTO[][] = [];
    for (let i: number = 0; i < this.numPlayers; i++) {
      this.results.forEach((result) => this.findPlayers(result, i, pGroups));
    }
    return pGroups;
  }

  private findPlayers(
    result: ResultDTO,
    i: number,
    pGroups: ParticipantDTO[][]
  ): void {
    //Busquem els participants que ja han jugat contra el participant de players[i]
    if (result.player1 == this.players[i].participantId) {
      pGroups[i].push(
        this.players.filter(
          (player) => player.participantId == result.player2
        )[0]
      );
    }
    if (result.player2 == this.players[i].participantId) {
      pGroups[i].push(
        this.players.filter(
          (player) => player.participantId == result.player1
        )[0]
      );
    }
  }

  private async createResults(result: ResultDTO): Promise<void> {
    //Grabem l'aparellament com a resultat buit
    try {
      await this.dbChessService.createResult(result);
      console.log('Aparellament creat correctament =)');
      console.log(
        'Ronda ' +
          result.roundNumber +
          ', tauler ' +
          result.boardNumber +
          ': ' +
          result.player1 +
          ' vs ' +
          result.player2
      );
    } catch (error: any) {
      window.alert(error.error);
    }
  }

  private lastRoundPending(): number {
    //Mirem si algun resultat indica que no ha acabat la ronda
    const res: ResultDTO | undefined = this.results.find(
      (result) => !result.roundEnded
    );
    if (res === undefined) {
      return 0;
    } else {
      return parseInt(res.roundNumber);
    }
  }

  goNextPairing(tournamentId: number): void {
    //Anem a la pàgina d'Aparellaments per a la següent ronda
    this.router.navigateByUrl('/tournament/pairing/' + tournamentId.toString());
  }

  goTournamentDetail(tournamentId: number): void {
    //Anem a la pàgina de Detall del Torneig
    this.router.navigateByUrl('/tournament/' + tournamentId.toString());
  }

  private generateBergerTable(players: number[]): number[][] {
    const n: number = players.length;
    const table: number[][] = [];

    // Generar la taula Berger
    for (let i = 0; i < n - 1; i++) {
      const row: number[] = [];

      // Parelles de jugadors per a cada ronda
      for (let j = 0; j < n / 2; j++) {
        const playerA = players[j];
        const playerB = players[n - 1 - j];

        // Alterna l'ordre de la parella per cada ronda
        if (i % 2 === 1) {
          row.push(playerB, playerA);
        } else {
          row.push(playerA, playerB);
        }
      }

      // Rotar l'array de jugadors per mantenir l'equitat en les rondes següents
      players.splice(1, 0, players.pop() as number);

      table.push(row);
    }

    return table;
  }

  /*
  interface Jugador {
    id: number;
    puntuacio: number;
    valoracio: number;
    aro: number;
    historialColores: number[]; // 0 para negras, 1 para blancas
}
*/

  private async doSwissPairing(round: number): Promise<void> {
    console.log('aparellament suís');
    console.log(this.tournament);
    console.log(this.players);
    console.log(this.results);

    const swissPlayers: PlayerDTO[] = [];
    this.fillPlayerData(swissPlayers);
    console.log(swissPlayers);
    this.sortPlayers(swissPlayers);
  }

  private fillPlayerData(array: PlayerDTO[]): void {
    this.players.forEach((player) => {
      let sPlayer: PlayerDTO = new PlayerDTO(player.participantId, player.elo);
      let j: number = 0;

      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i].player1 === player.participantId) {
          sPlayer.historialColores[j] = 1;
          let opponent: ParticipantDTO = this.getWhiteOpponent(i);
          sPlayer.aro += opponent.elo;
          j++;
        }
        if (this.results[i].player2 === player.participantId) {
          sPlayer.historialColores[j] = 0;
          let opponent: ParticipantDTO = this.getBlackOpponent(i);
          sPlayer.aro += opponent.elo;
          j++;
        }
      }

      sPlayer.puntuacio = player.wins + 0.5 * player.ties;
      sPlayer.aro = sPlayer.aro / j;

      array.push(sPlayer);
    });
  }

  private sortPlayers(array: PlayerDTO[]): void {
    array.sort((a, b) => {
      let diff: number;
      if (b.puntuacio !== a.puntuacio) {
        diff = b.puntuacio - a.puntuacio;
      } else if (a.aro !== b.aro) {
        diff = a.aro - b.aro;
      } else {
        diff = b.r - a.r;
      }
      return diff;
    });
  }

  private getWhiteOpponent(n: number): ParticipantDTO {
    let player: ParticipantDTO;
    this.players.forEach((elem) => {
      if (elem.participantId === this.results[n].player2) {
        player = elem;
      }
    });
    return player!;
  }
  private getBlackOpponent(n: number): ParticipantDTO {
    let player: ParticipantDTO;
    this.players.forEach((elem) => {
      if (elem.participantId === this.results[n].player1) {
        player = elem;
      }
    });
    return player!;
  }

  private generarAparellamentSuísDubov(
    jugadors: PlayerDTO[]
  ): [PlayerDTO, PlayerDTO][] {
    // Ordenar los jugadores por puntuación (descendente), ARO (ascendente) y valoración (descendente)
    jugadors.sort((a, b) => {
      if (b.puntuacio !== a.puntuacio) {
        return b.puntuacio - a.puntuacio;
      } else if (a.aro !== b.aro) {
        return a.aro - b.aro;
      } else {
        return b.r - a.r;
      }
    });

    const aparellaments: [PlayerDTO, PlayerDTO][] = [];

    // Iterar sobre los aparellamientos de la ronda actual
    for (let i = 0; i < jugadors.length; i += 2) {
      const jugadorA = jugadors[i];
      const jugadorB = jugadors[i + 1];

      // Verificar si que no es jugui 3 vegades seguides amb el mateix color
      let nextA = this.checkTwoLastRounds(jugadorA);
      let nextB = this.checkTwoLastRounds(jugadorB);
      if (nextA !== -1) {
        // Intercambiar colores para evitar tres veces seguidas
        if (nextA === 0) {
          aparellaments.push([jugadorB, jugadorA]);
          jugadorA.historialColores.push(0);
          jugadorB.historialColores.push(1);
        } else {
          aparellaments.push([jugadorA, jugadorB]);
          jugadorA.historialColores.push(1);
          jugadorB.historialColores.push(0);
        }
      } else if (nextB !== -1) {
        // Intercambiar colores para evitar tres veces seguidas
        if (nextB === 0) {
          aparellaments.push([jugadorA, jugadorB]);
          jugadorA.historialColores.push(1);
          jugadorB.historialColores.push(0);
        } else {
          aparellaments.push([jugadorB, jugadorA]);
          jugadorA.historialColores.push(0);
          jugadorB.historialColores.push(1);
        }
      } else {
        // Determinar la preferencia de color
        const preferenciaColorA = this.determinarPreferenciaColor(jugadorA);
        const preferenciaColorB = this.determinarPreferenciaColor(jugadorB);

        // Emparejar jugadores según preferencia de color
        if (preferenciaColorA === 1 && preferenciaColorB === 0) {
          aparellaments.push([jugadorA, jugadorB]);
        } else if (preferenciaColorA === 0 && preferenciaColorB === 1) {
          aparellaments.push([jugadorB, jugadorA]);
        } else {
          // Si ambos jugadores tienen la misma preferencia de color, emparejar según puntuación
          aparellaments.push([jugadorA, jugadorB]);
        }

        // Actualizar historial de colores
        jugadorA.historialColores.push(preferenciaColorA);
        jugadorB.historialColores.push(preferenciaColorB);
      }
    }

    return aparellaments;
  }

  // Función para verificar si se juegan tres veces seguidas con el mismo color
  private checkTwoLastRounds(jugador: PlayerDTO): number {
    const historial: number[] = jugador.historialColores;
    const numPartidas: number = historial.length;
    let next: number = -1;

    if (numPartidas >= 2) {
      const penultim: number = historial[numPartidas - 2];
      const ultim: number = historial[numPartidas - 1];

      if (penultim === ultim) {
        if (ultim === 0) {
          next = 1;
        } else {
          next = 0;
        }
      }
    }

    return next;
  }

  // Función para determinar la preferencia de color de un jugador basada en su historial de colores
  private determinarPreferenciaColor(jugador: PlayerDTO): number {
    const historial: number[] = jugador.historialColores;
    const numPartidas: number = historial.length;
    // Determinar preferencia de color basada en el historial
    const colorUltimaPartida: number = historial[numPartidas - 1];
    let colorNextRound: number;

    // Preferir el color opuesto al de la última partida
    if (colorUltimaPartida === 0) {
      colorNextRound = 1;
    } else {
      colorNextRound = 0;
    }
    return colorNextRound;
  }
}
