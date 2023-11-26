import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRankingComponent } from './tournament-ranking.component';

describe('TournamentRankingComponent', () => {
  let component: TournamentRankingComponent;
  let fixture: ComponentFixture<TournamentRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentRankingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
