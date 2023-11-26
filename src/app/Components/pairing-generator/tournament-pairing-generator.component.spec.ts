import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPairingGeneratorComponent } from './tournament-pairing-generator.component';

describe('TournamentPairingGeneratorComponent', () => {
  let component: TournamentPairingGeneratorComponent;
  let fixture: ComponentFixture<TournamentPairingGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentPairingGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentPairingGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
