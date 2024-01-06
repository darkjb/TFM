export class PlayerDTO {
  id: number;
  puntuacio: number;
  r: number;
  aro: number;
  historialColores: number[]; // 0 para negras, 1 para blancas

  constructor(id: number, r: number) {
    this.id = id;
    this.puntuacio = 0;
    this.r = r;
    this.aro = 0;
    this.historialColores = [];
  }
}
