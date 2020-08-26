import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentService } from '../data-service/comment-service';
import { UserService } from '../data-service/user-service';
import { Apollo } from 'apollo-angular';
import { Channel } from '../model/channel';
import { Comments } from '../model/comment';
import gql from 'graphql-tag';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input('com') comment: {
    commentId: number
    videoId: number
    channelId: number
    channelName: string
    channelEmail: string
    channelPhotoURL: string
    content: string
    replyTo: number
    likes: number
    dislikes: number
    day: number
    month: number
    year: number
    replies: number
    time: number
  }

  howMany: number
  commentTemp: Comments[] = []
  passComments: Comments[] = []
  currComment: Comments
  commentQty: number
  content: string = ""
  dummyId: any
  dummyId2: any
  dummyId3: any
  dummyId4: any
  dummyId5: any
  dummyId6: any
  user: any
  allChannels: Channel[] = []
  loggedInChannel: Channel
  posterChannel: Channel
  isLiked: boolean
  isDisliked: boolean
  post: string

  constructor(private apollo: Apollo, private commentService: CommentService, private userService: UserService) { }

  ngOnInit(): void {
    this.dummyId = "id" + this.comment.commentId
    this.dummyId2 = "reply" + this.comment.commentId
    this.dummyId3 = "view" + this.comment.commentId
    this.dummyId4 = "hide" + this.comment.commentId
    this.dummyId5 = "like" + this.comment.commentId
    this.dummyId6 = "dislike" + this.comment.commentId
    this.user = JSON.parse(localStorage.getItem('users'))
    this.processPost()
    
    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.allChannels = result.data.channels
      this.posterChannel = this.allChannels.find(c => c.email == this.comment.channelEmail)
      this.loggedInChannel = this.allChannels.find(c => c.email == this.user.email)
    })

    this.commentService.fetchComments(this.comment.videoId).valueChanges.subscribe( result => {
      this.commentTemp = result.data.comments
      this.currComment = this.commentTemp.find( c => c.commentId == this.comment.commentId)
      this.filterComments(this.commentTemp)
    })

    this.findCommentLike(this.comment.commentId, this.user.email)
    this.findCommentDislike(this.comment.commentId, this.user.email)
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
    this.commentService.registerCommentLike(this.comment.commentId, this.loggedInChannel.id, this.user.email)
    this.paintBlue(this.dummyId5)
    this.isLiked = true
  }

  unLike(): void {
    this.commentService.decreaseCommentLike(this.comment.commentId, this.comment.videoId)
    this.commentService.removeCommentLike(this.comment.commentId, this.user.email)
    this.paintGrey(this.dummyId5)
    this.isLiked = false
  }

  dislike(): void {
    this.commentService.increaseCommentDislike(this.comment.commentId, this.comment.videoId)
    this.commentService.registerCommentDislike(this.comment.commentId, this.loggedInChannel.id, this.user.email)
    this.paintBlue(this.dummyId6)
    this.isDisliked = true
  }

  unDislike(): void {
    this.commentService.decreaseCommentDislike(this.comment.commentId, this.comment.videoId)
    this.commentService.removeCommentDislike(this.comment.commentId, this.user.email)
    this.paintGrey(this.dummyId6)
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

  addComment(): void {
    this.commentService.addReplyCount(this.comment.commentId, this.comment.videoId)
    this.commentService.addComment(this.comment.videoId, this.loggedInChannel, this.content, this.comment.commentId)
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

  filterComments(array: Comments[]): void {
    let j = 0;
    for(let i = 0; i < array.length; i++) {
      if(array[i].replyTo == this.comment.commentId) {
        this.passComments[j] = array[i]
        j++
      }
    }
    if(j != 0)
      this.howMany = j
  }

  findCommentLike(commentId: any, channelEmail: any): any {
     this.apollo.watchQuery<any>({
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
    }).valueChanges.subscribe( result => {
      if(result.data.findCommentLike.length > 0) {
        this.isLiked = true
        setTimeout( ()=> {
          this.paintBlue(this.dummyId5)
        }, 2000)
      }
      else {
        this.isLiked = false
        setTimeout( ()=> {
          this.paintGrey(this.dummyId5)
        }, 2000)
      }
    })
  }

  findCommentDislike(commentId: any, channelEmail: any): any {
     this.apollo.watchQuery<any>({
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
    }).valueChanges.subscribe( result => {
      if(result.data.findCommentDislike.length > 0) {
        this.isDisliked = true 
        setTimeout( ()=> {
          this.paintBlue(this.dummyId6)
        }, 2000)
      }
      else {
        this.isDisliked = false 
        setTimeout( ()=> {
          this.paintGrey(this.dummyId6)
        }, 2000)
      }
    })
  }
}
