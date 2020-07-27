import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Comments } from '../comment'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

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

  replies: Comments[] = []
  dummyId: any
  user: any

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.dummyId = "id" + this.comment.commentId
    this.user = JSON.parse(localStorage.getItem('users'))

    if(parseInt(this.comment.replies.toString()) != 0) {
      this.fetchReplies()
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

  fetchReplies(): void {
    this.apollo.watchQuery<any>({
      query: gql`
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
      `,
      variables: {
        replyTo: this.comment.commentId
      }
    }).valueChanges.subscribe( result => {
      console.log(result)
      this.replies = result.data.findReply
      console.log(this.replies)
    })
  }

}
