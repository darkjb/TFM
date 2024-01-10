import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRoundsListComponent } from './tournament-rounds-list.component';

describe('TournamentRoundsListComponent', () => {
  let component: TournamentRoundsListComponent;
  let fixture: ComponentFixture<TournamentRoundsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentRoundsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentRoundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
