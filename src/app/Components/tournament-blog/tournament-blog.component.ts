import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogDTO } from 'src/app/Models/blog.dto';
import { CommentDTO } from 'src/app/Models/comment.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { TournamentDTO } from 'src/app/Models/tournament.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DbChessService } from 'src/app/Services/tournament.service';

@Component({
  selector: 'app-tournament-blog',
  templateUrl: './tournament-blog.component.html',
  styleUrls: ['./tournament-blog.component.scss'],
})
export class TournamentBlogComponent {
  blog!: BlogDTO[];
  comments!: CommentDTO[];
  tournament!: TournamentDTO;
  owner: boolean;
  permission: boolean;
  permission2: boolean[] = [];
  // showButtons: boolean;
  constructor(
    private dbChessService: DbChessService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    // this.showButtons = false;
    this.permission = false;
    this.owner = false;
    this.loadComments();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          // this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private async loadComments(): Promise<void> {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      //  this.showButtons = true;
    }
    await this.getComments(identifier);
    await this.getTournament(identifier);
    await this.getNames();
    await this.getPermissions();
    console.log(this.comments);
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
    console.log(this.comments);
  }

  private async getTournament(tournamentId: string): Promise<void> {
    try {
      this.tournament = (await this.dbChessService.getTournamentById(tournamentId))[0];
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
    if (this.localStorageService.get('user_id')) {
      if (this.localStorageService.get('user_id')! == this.tournament.ownerId.toString())
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

  goAddComment(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.router.navigateByUrl('/tournament/blog/add_comment/' + identifier);
  }
}
