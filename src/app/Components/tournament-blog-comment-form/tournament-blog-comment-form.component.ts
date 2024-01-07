import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentDTO } from 'src/app/Models/comment.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-blog-comment-form',
  templateUrl: './tournament-blog-comment-form.component.html',
  styleUrls: ['./tournament-blog-comment-form.component.scss'],
})
export class TournamentBlogCommentFormComponent {
  comment: CommentDTO;
  text: FormControl;

  commentForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dbChessService: DbChessService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.isValidForm = null;
    this.comment = new CommentDTO();

    this.text = new FormControl(this.comment.text, [
      Validators.required,
      Validators.maxLength(250),
    ]);

    this.commentForm = this.formBuilder.group({
      text: this.text,
    });
  }

  getTextErrorMessage(): string {
    let message = '';

    if (this.text.hasError('required')) {
      message = 'El comentari no pot estar en blanc';
    }

    if (this.text.hasError('maxlength')) {
      message = 'El text no pot tenir més de 250 caràcters';
    }

    return message;
  }

  async sendForm(): Promise<void> {
    this.comment = {
      commentId: 0,
      tournamentId: 0,
      userId: 0,
      likes: 0,
      dislikes: 0,
      text: this.text.value,
    };

    this.comment.tournamentId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    this.comment.userId = parseInt(this.localStorageService.get('user_id')!);

    if (await this.dbChessService.createComment(this.comment)) {
      window.alert('Comentari afegit correctament =)');
      this.goBlogPage();
    } else {
      window.alert('Ha fallat alguna cosa, torna a intentar-ho més tard =(');
    }
    //console.log(this.tournament);
  }

  goBlogPage(): void {
    this.router.navigateByUrl(
      '/tournament/blog/' + this.activatedRoute.snapshot.paramMap.get('id')!
    );
  }

  goTournamentDetail(): void {
    this.router.navigateByUrl(
      '/tournament/' + this.activatedRoute.snapshot.paramMap.get('id')!
    );
  }

  mostrarDatos(): void {
    console.log(this.comment);
  }
}
