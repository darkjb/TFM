import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBlogEntryFormComponent } from './tournament-blog-entry-form.component';

describe('TournamentBlogEntryFormComponent', () => {
  let component: TournamentBlogEntryFormComponent;
  let fixture: ComponentFixture<TournamentBlogEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentBlogEntryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentBlogEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
