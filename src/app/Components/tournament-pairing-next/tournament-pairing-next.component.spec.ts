import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPairingNextComponent } from './tournament-pairing-next.component';

describe('TournamentPairingNextComponent', () => {
  let component: TournamentPairingNextComponent;
  let fixture: ComponentFixture<TournamentPairingNextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentPairingNextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentPairingNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
