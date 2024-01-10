import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBlogCommentFormComponent } from './tournament-blog-comment-form.component';

describe('TournamentBlogCommentFormComponent', () => {
  let component: TournamentBlogCommentFormComponent;
  let fixture: ComponentFixture<TournamentBlogCommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentBlogCommentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentBlogCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
