import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { VideoPlayComponent } from '../video-play/video-play.component';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-nested-comment',
  templateUrl: './nested-comment.component.html',
  styleUrls: ['./nested-comment.component.scss']
})
export class NestedCommentComponent implements OnInit {

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

  dummyId: any
  user: any
  template: any
  d: any
  m: any
  y: any

  constructor(private videoPlay: VideoPlayComponent, private apollo: Apollo, private commentComponent: CommentComponent) { }

  ngOnInit(): void {
    this.dummyId = 'open' + this.comment.commentId
    this.user = JSON.parse(localStorage.getItem('users'))
    this.template = '@' + this.comment.channelName + ' '
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

  addComment(): void {
    var date = new Date()
    this.d = date.getDate()
    this.m = date.getMonth()
    this.y = date.getFullYear()
    this.addReplyCount()
    this.addCommentQuery()
    this.template = ""
  }

  addCommentQuery(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation createComment(
          $videoId: Int!, 
          $channelId: Int!,
          $channelName: String!,
          $channelEmail: String!,
          $channelPhotoURL: String!,
          $content: String!,
          $replyTo: Int!,
          $likes: Int!,
          $dislikes: Int!,
          $day: Int!,
          $month: Int!,
          $year: Int!,
          $replies: Int!,
        ) {
          addComment(input: {
            videoId: $videoId,
            channelId: $channelId,
            channelName: $channelName,
            channelEmail: $channelEmail,
            channelPhotoURL: $channelPhotoURL,
            content: $content,
            replyTo: $replyTo,
            likes: $likes,
            dislikes: $dislikes,
            day: $day,
            month: $month,
            year: $year,
            replies: $replies,
          }) {
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
            replies,
          }
        }
      `,
      variables: {
        videoId: this.comment.videoId,
        channelId: this.commentComponent.channel.data.findChannel[0].id,
        channelName: this.user.name,
        channelEmail: this.user.email,
        channelPhotoURL: this.user.photoUrl,
        content: this.template,
        replyTo: this.comment.replyTo,
        likes: 0,
        dislikes: 0,
        day: this.d,
        month: this.m,
        year: this.y,
        replies: 0,
      },
    }).subscribe( result => {
      console.log(result)
    })
  }

  addReplyCount(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation addCount($commentId: ID!){
          addReplyCount(commentId: $commentId)
        }
      `,
      variables: {
        commentId: this.comment.commentId
      }
    }).subscribe()
  }
}
