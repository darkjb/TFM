import { TestBed } from '@angular/core/testing';

import { DbChessService } from './tournament.service';

describe('TournamentService', () => {
  let service: DbChessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbChessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
