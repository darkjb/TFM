import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBlogComponent } from './tournament-blog.component';

describe('TournamentBlogComponent', () => {
  let component: TournamentBlogComponent;
  let fixture: ComponentFixture<TournamentBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentBlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
