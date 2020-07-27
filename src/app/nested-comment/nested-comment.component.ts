import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
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

}
