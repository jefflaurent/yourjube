import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Comments } from '../model/comment';
import { CommentService } from '../data-service/comment-service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  getReplyQuery = gql`
  query getReply($replyTo: Int!){
    findReply(replyTo: $replyTo){
      commentId,
      videoId,
      channelId,
      channelName,
      channelEmail,
      channelPhotoURL,
      content,
      replyTo,
      likes,
      dislikes,
      day,
      month,
      year,
      replies
    }
  }
`;

getCommentQuery = gql`
  query getComments($videoId: Int!){
      comments(videoId: $videoId) {
        commentId,
        videoId,
        channelId,
        channelName,
        channelEmail,
        channelPhotoURL,
        content,
        replyTo,
        likes,
        dislikes,
        day,
        month,
        year,
        replies
      }
    }
  `;

  @Input('com') comment: {
    commentId: BigInteger,
    videoId: BigInteger,
    channelId: BigInteger,
    channelName: string,
    channelEmail: string,
    channelPhotoURL: string,
    content: string,
    replyTo: BigInteger,
    likes: BigInteger,
    dislikes: BigInteger,
    day: BigInteger,
    month: BigInteger,
    year: BigInteger,
    replies: BigInteger,
  }

  howMany: number
  replies: Comments[] = []
  passComments: Comments[] = []
  commentQty: number
  content: string = ""
  dummyId: any
  dummyId2: any
  dummyId3: any
  dummyId4: any
  user: any
  channel: any
  d: any
  m: any
  y: any

  constructor(private apollo: Apollo, private commentService: CommentService) { }

  ngOnInit(): void {
    this.dummyId = "id" + this.comment.commentId
    this.dummyId2 = "reply" + this.comment.commentId
    this.dummyId3 = "view" + this.comment.commentId
    this.dummyId4 = "hide" + this.comment.commentId
    this.user = JSON.parse(localStorage.getItem('users'))
    this.fetchUser();
    this.fetchComments();

    if(parseInt(this.comment.replies.toString()) != 0) {
      this.fetchReplies()
    }
  }

  addComment(): void {
    this.commentService.addReplyCount(this.comment.commentId, this.comment.videoId)
    this.commentService.addComment(this.comment.videoId, this.channel, this.content, this.comment.commentId)
    this.content = ""
  }

  openReply(): void {
    var query = '#' + this.dummyId
    var btn = document.querySelector(query)
    btn.classList.remove('closed')
  }

  closeReply(): void {
    var query = '#' + this.dummyId
    var btn = document.querySelector(query)
    btn.classList.add('closed')
  }

  showReply(): void {
    var query = '#' + this.dummyId2
    var query2 = '#' + this.dummyId3
    var query3 = '#' + this.dummyId4
    var btn = document.querySelector(query)
    var btn2 = document.querySelector(query2)
    var btn3 = document.querySelector(query3)
    btn.classList.remove('closed')
    btn2.classList.add('closed')
    btn3.classList.remove('closed')
  }

  hideReply(): void {
    var query = '#' + this.dummyId2
    var query2 = '#' + this.dummyId3
    var query3 = '#' + this.dummyId4
    var btn = document.querySelector(query)
    var btn2 = document.querySelector(query2)
    var btn3 = document.querySelector(query3)
    btn.classList.add('closed')
    btn2.classList.remove('closed')
    btn3.classList.add('closed')
  }

  fetchReplies(): void {
    this.apollo.watchQuery<any>({
      query: this.getReplyQuery,
      variables: {
        replyTo: this.comment.commentId
      }
    }).valueChanges.subscribe( result => {
      this.replies = result.data.findReply
      this.howMany = result.data.findReply.length
    })
  }

  fetchUser(): void {
    this.apollo.query<any>({
      query: gql`
        query getUser($email: String!) {
          findChannel(email: $email) {
            id,
            name,
            email,
            photoURL,
            bannerURL,
            subscriber,
            isPremium,
          }
        }
      `,
      variables: {
        email: this.user.email
      },
    }).subscribe( channel => {
      this.channel = channel.data.findChannel[0];
    })
  }

  fetchComments(): void {
    this.apollo.watchQuery<any>({
      query: this.getCommentQuery,
      variables:{
        videoId: this.comment.videoId
      }
    }).valueChanges.subscribe(result => {
      this.passComments = result.data.comments
      this.commentQty = result.data.comments.length
    })
  }
}
