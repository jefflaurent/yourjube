import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { VideoPlayComponent } from '../video-play/video-play.component';
import { CommentService } from '../data-service/comment-service';
import { UserService } from '../data-service/user-service';
import { Channel } from '../model/channel';
import { Comments } from '../model/comment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-nested-comment',
  templateUrl: './nested-comment.component.html',
  styleUrls: ['./nested-comment.component.scss']
})
export class NestedCommentComponent implements OnInit {

  @Input('com') comment: {
    commentId: number,
    videoId: number,
    channelId: number,
    channelName: string,
    channelEmail: string,
    channelPhotoURL: string,
    content: string,
    replyTo: number,
    likes: number,
    dislikes: number,
    day: number,
    month: number,
    year: number,
    replies: number,
    time: number
  }

  comments: Comments[] = []
  tempComments: Comments[] = []
  currComment: Comments
  dummyId: any
  dummyId10: any
  dummyId11: any
  user: any
  template: any
  channel: any
  isLiked: boolean
  isDisliked: boolean
  post: string

  allChannels: Channel[] = []
  posterChannel: Channel
  loggedInChannel: Channel

  constructor(private videoPlay: VideoPlayComponent, private apollo: Apollo, private commentComponent: CommentComponent, private commentService: CommentService, private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'))
    this.processPost()
    
    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.allChannels = result.data.channels
      this.posterChannel = this.allChannels.find(c => c.email == this.comment.channelEmail)
      this.loggedInChannel = this.allChannels.find(c => c.email == this.user.email)
    })

    this.dummyId = 'open' + this.comment.commentId
    this.dummyId10 = 'nestedlike' + this.comment.commentId
    this.dummyId11 = 'nesteddislike' + this.comment.commentId
    this.template = '@' + this.comment.channelName + ' '

    this.commentService.fetchComments(this.comment.videoId).valueChanges.subscribe( result => {
      this.comments = result.data.comments
      this.currComment = this.comments.find( c => c.commentId == this.comment.commentId)
    })

    this.findCommentLike(this.comment.commentId, this.user.email)
    this.findCommentDislike(this.comment.commentId, this.user.email)
  }

  processPost(): void {
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.comment.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 0)
          this.post = 'Today'
        else if(count == 1)
          this.post = count + ' day ago'
        else
          this.post = count + ' days ago'
      }
      else if(gap >= 604800000) {
        if(gap >= 604800000 && gap < 1209600000)
          this.post = '1 week ago'
        else if(gap >= 1209600000 && gap < 1814400000)
          this.post = '2 weeks ago'
        else if(gap >= 1814400000 && gap < 2419200000)
          this.post = '3 weeks ago'
        else if(gap >= 2419200000)
          this.post = '4 weeks ago'
      }
    }
    else if(gap < 30758400000) {
      count = gap / 2678400000
      count = Math.floor(count)

      if(count == 1)
        this.post = count + ' month ago'
      else
        this.post = count + ' months ago'
    }
    else {
      count = gap / 30758400000
      count = Math.floor(count)
      
      if(gap == 1) 
        this.post = gap + ' year ago';
      else
        this.post = gap + ' years ago';
    }
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
    this.commentService.addComment(this.comment.videoId, this.channel, this.template, this.comment.replyTo)
    this.commentService.addReplyCount(this.comment.replyTo, this.comment.videoId)
    this.template = ""
  }

  initiateLike(): void {
    if(this.isLiked)
      this.unLike()
    else {
      this.like()
      if(this.isDisliked)
        this.unDislike()
    }
  }

  initiateDislike(): void {
    if(this.isDisliked)
      this.unDislike()
    else {
      this.dislike()
      if(this.isLiked)
        this.unLike()
    }
  }

  like(): void {
    this.commentService.increaseCommentLike(this.comment.commentId, this.comment.videoId)
    this.commentService.registerCommentLike(this.comment.commentId, this.channel.id, this.user.email)
    this.paintBlue(this.dummyId10)
    this.isLiked = true
  }

  unLike(): void {
    this.commentService.decreaseCommentLike(this.comment.commentId, this.comment.videoId)
    this.commentService.removeCommentLike(this.comment.commentId, this.user.email)
    this.paintGrey(this.dummyId10)
    this.isLiked = false
  }

  dislike(): void {
    this.commentService.increaseCommentDislike(this.comment.commentId, this.comment.videoId)
    this.commentService.registerCommentDislike(this.comment.commentId, this.channel.id, this.user.email)
    this.paintBlue(this.dummyId11)
    this.isDisliked = true
  }

  unDislike(): void {
    this.commentService.decreaseCommentDislike(this.comment.commentId, this.comment.videoId)
    this.commentService.removeCommentDislike(this.comment.commentId, this.user.email)
    this.paintGrey(this.dummyId11)
    this.isDisliked = false
  }

  paintBlue(id): void {
    var query = '#' + id
    var btn = document.querySelector(query)
    btn.classList.add('clicked')
  }

  paintGrey(id): void {
    var query = '#' + id
    var btn = document.querySelector(query)
    btn.classList.remove('clicked')
  }

  findCommentLike(commentId: any, channelEmail: any): any {
    this.apollo.query({
     query: gql`
       query findCommentLike($channelEmail: String!, $commentId: Int!) {
         findCommentLike(channelEmail: $channelEmail, commentId: $commentId) {
           commentLikeId,
           commentId,
           channelId,
           channelEmail,
         }
       }
     `,
     variables: {
       channelEmail: channelEmail,
       commentId: commentId,
     }
   }).subscribe( result => {
     if((result as any).data.findCommentLike.length > 0) {
       this.isLiked = true
       setTimeout( ()=> {
         this.paintBlue(this.dummyId10)
       }, 2000)
     }
     else {
       this.isLiked = false
       setTimeout( ()=> {
         this.paintGrey(this.dummyId10)
       }, 2000)
     }
   })
 }

 findCommentDislike(commentId: any, channelEmail: any): any {
    this.apollo.query({
     query: gql`
       query findCommentDislike($channelEmail: String!, $commentId: Int!) {
         findCommentDislike(channelEmail: $channelEmail, commentId: $commentId) {
           commentDislikeId,
           commentId,
           channelId,
           channelEmail,
         }
       }
     `,
     variables: {
       channelEmail: channelEmail,
       commentId: commentId,
     }
   }).subscribe( result => {
     if((result as any).data.findCommentDislike.length > 0) {
       this.isDisliked = true 
       setTimeout( ()=> {
         this.paintBlue(this.dummyId11)
       }, 2000)
     }
     else {
       this.isDisliked = false 
       setTimeout( ()=> {
         this.paintGrey(this.dummyId11)
       }, 2000)
     }
   })
 }
}
