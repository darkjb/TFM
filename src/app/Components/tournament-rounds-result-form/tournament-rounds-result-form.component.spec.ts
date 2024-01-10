import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRoundsResultFormComponent } from './tournament-rounds-result-form.component';

describe('TournamentRoundsResultFormComponent', () => {
  let component: TournamentRoundsResultFormComponent;
  let fixture: ComponentFixture<TournamentRoundsResultFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentRoundsResultFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentRoundsResultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
