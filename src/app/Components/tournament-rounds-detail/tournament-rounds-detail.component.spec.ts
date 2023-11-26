import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRoundsDetailComponent } from './tournament-rounds-detail.component';

describe('TournamentRoundsDetailComponent', () => {
  let component: TournamentRoundsDetailComponent;
  let fixture: ComponentFixture<TournamentRoundsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentRoundsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentRoundsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
