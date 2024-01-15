import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentDTO } from 'src/app/Models/comment.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-blog',
  templateUrl: './tournament-blog.component.html',
  styleUrls: ['./tournament-blog.component.scss'],
})
export class TournamentBlogComponent {
  comments!: CommentDTO[];
  tournament!: TournamentDTO;
  owner: boolean;
  permission: boolean;
  permission2: boolean[] = [];
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.permission = false;
    this.owner = false;
  }

  async ngOnInit(): Promise<void> {
    await this.loadComments();
  }

  private async loadComments(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    await this.getComments(identifier);
    await this.getTournament(identifier);
    await this.getNames();
    await this.getPermissions();
  }

  private async getComments(tournamentId: string): Promise<void> {
    try {
      this.comments = await this.dbChessService.getCommentsById(tournamentId);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    if (this.localStorageService.get('user_id')) {
      this.permission = true;
    }
  }

  private async getTournament(tournamentId: string): Promise<void> {
    try {
      this.tournament = (
        await this.dbChessService.getTournamentById(tournamentId)
      )[0];
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    if (this.localStorageService.get('user_id')) {
      if (
        this.localStorageService.get('user_id')! ==
        this.tournament.ownerId.toString()
      )
        this.owner = true;
    }
  }

  private async getNames(): Promise<void> {
    for (let i = 0; i < this.comments.length; i++) {
      this.comments[i].ownerName = await this.getName(this.comments[i].userId);
    }
  }

  private async getPermissions(): Promise<void> {
    let userId: number = 0;
    this.permission2.length = 0;
    if (this.localStorageService.get('user_id')) {
      userId = parseInt(this.localStorageService.get('user_id')!);
    }
    for (let i = 0; i < this.comments.length; i++) {
      this.permission2.push(this.comments[i].userId === userId);
    }
  }

  private async getName(id: number): Promise<string> {
    let name = '';
    if (id > 0) {
      try {
        const users: UserDTO[] = await this.dbChessService.getUserName(id);
        if (users.length > 0) {
          name = users[0].name + ' ' + users[0].surname;
        }
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
    return name;
  }

  async doLike(commentId: number): Promise<void> {
    let comment: CommentDTO = (
      await this.dbChessService.getCommentById(commentId)
    )[0];
    comment.likes++;
    await this.dbChessService.updateComment(comment);
    await this.loadComments();
  }

  async doDislike(commentId: number): Promise<void> {
    let comment: CommentDTO = (
      await this.dbChessService.getCommentById(commentId)
    )[0];
    comment.dislikes++;
    this.dbChessService.updateComment(comment);
    this.loadComments();
  }

  async deleteComment(commentId: number): Promise<void> {
    if (await this.dbChessService.deleteComment(commentId)) {
      window.alert('Comentari eliminat correctament =)');
      this.loadComments();
    } else {
      window.alert('Ha fallat alguna cosa, torna a intentar-ho més tard =(');
    }
  }

  goTournamentDetail(): void {
    this.router.navigateByUrl(
      '/tournament/' + this.activatedRoute.snapshot.paramMap.get('id')!
    );
  }

  goAddComment(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.router.navigateByUrl('/tournament/blog/add_comment/' + identifier);
  }
}
