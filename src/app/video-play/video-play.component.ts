import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Videos } from '../model/video';
import { Comments } from '../model/comment';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.scss']
})
export class VideoPlayComponent implements OnInit {

  getVideoQuery = gql`
    query getVideos {
      videos {
        videoId,
        videoTitle,
        videoDesc,
        videoURL,
        videoThumbnail,
        uploadDay,
        uploadMonth,
        uploadYear,
        views,
        likes,
        dislikes,
        visibility,
        viewer,
        category,
        channelName,
        channelPhotoURL,
        channelEmail,
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

  firstVideo: Videos[] = [];
  videos: Videos[] = [];
  passVideos: Videos[] = [];
  showComments: Comments[] = [];
  comments: Comments[] = [];
  currVid: Videos
  id: any
  month: any
  post: string
  channel: any = null
  isLimited: boolean = true
  isLiked: boolean
  isDisliked: boolean
  commentQty: number
  user: any
  content: string = ""
  declare: any
  d: number
  m: number
  y: number

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchVideos();
    this.user = JSON.parse(localStorage.getItem('users'))
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.watchVideo();
      this.fetchComments();
      this.checkLiked();
      this.checkDisliked();
    })
  }

  expandField() : void {
    var field = document.querySelector('.desc-bot')
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')

    btnShrink.classList.remove('hidden')
    btnExpand.classList.add('hidden')
    field.classList.remove('limited')
    this.isLimited = false
  }

  shrinkField() : void {
    var field = document.querySelector('.desc-bot')
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')

    btnShrink.classList.add('hidden')
    btnExpand.classList.remove('hidden')

    field.classList.add('limited')
    this.isLimited = true
  }

  watchVideo(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation watch($videoId: ID!){
          watchVideo(videoId: $videoId)
        }
      `,
      variables: {
        videoId: this.id
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  paintBlue(whichClass): void {
    var container = document.querySelector(whichClass)
    container.classList.add('clicked')
  }

  paintGrey(whichClass): void {
    var container = document.querySelector(whichClass)
    container.classList.remove('clicked')
  }

  initiateLike(): void {
    if(this.isLiked == false) {
      this.like()
      if(this.isDisliked == true)
        this.undislike()
    } else if(this.isLiked == true){
      this.unlike()
    }
  }

  initiateDislike(): void {
    if(this.isDisliked == false) {
      this.dislike()
      if(this.isLiked == true)
        this.unlike()
    } else if(this.isDisliked == true){
      this.undislike();
    }
  }

  addComment(): void {
    var date = new Date()
    this.d = date.getDate()
    this.m = date.getMonth()
    this.y = date.getFullYear()
    this.addCommentQuery()
    this.content = " "
  }

  like(): void {
    this.addLike()
    this.increaseLike()
    this.isLiked = true
    this.paintBlue('.like')
  }

  unlike(): void {
    this.removeLike()
    this.decreaseLike()
    this.isLiked = false
    this.paintGrey('.like')
  }

  dislike(): void {
    this.addDislike()
    this.increaseDislike()
    this.isDisliked = true
    this.paintBlue('.dislike')
  }

  undislike(): void {
    this.removeDislike()
    this.decreaseDislike()
    this.isDisliked = false
    this.paintGrey('.dislike')
  }

  increaseLike(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation increase($videoId: ID!){
          likeVideo(videoId: $videoId)
        }
      `,
      variables: {
        videoId: this.id
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  decreaseLike(): void{
    this.apollo.mutate({
      mutation: gql`
        mutation decrease($videoId: ID!){
          decreaseLike(videoId: $videoId)
        }
      `,
      variables: {
        videoId: this.id
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }
  
  addLike(): void{
    this.apollo.mutate({
      mutation: gql`
        mutation add($channelId: Int!, $channelEmail: String!, $videoId: Int!, $videoThumbnail: String!, $videoURL: String!){
          addLike(input: {
            channelId: $channelId,
            channelEmail: $channelEmail,
            videoId: $videoId,
            videoThumbnail: $videoThumbnail,
            videoURL: $videoURL,
          }) {
            channelId,
            channelEmail,
            videoId,
            videoThumbnail,
            videoURL,
          }
        }
      `,
      variables: {
        channelId: this.channel.data.findChannel[0].id,
        channelEmail: this.channel.data.findChannel[0].email,
        videoId: this.currVid.videoId, 
        videoThumbnail: this.currVid.videoThumbnail,
        videoURL: this.currVid.videoURL,
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  removeLike(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation remove($channelId: Int!, $videoId: Int!) {
          removeLike(channelId: $channelId, videoId: $videoId)
        }
      `,
      variables: {
        channelId: this.channel.data.findChannel[0].id,
        videoId: this.currVid.videoId
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  increaseDislike(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation increase($videoId: ID!){
          dislikeVideo(videoId: $videoId)
        }
      `,
      variables: {
        videoId: this.id
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  decreaseDislike(): void{
    this.apollo.mutate({
      mutation: gql`
        mutation decrease($videoId: ID!){
          decreaseDislike(videoId: $videoId)
        }
      `,
      variables: {
        videoId: this.id
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }
  
  addDislike(): void{
    this.apollo.mutate({
      mutation: gql`
        mutation add($channelId: Int!, $channelEmail: String!, $videoId: Int!, $videoThumbnail: String!, $videoURL: String!){
          addDislike(input: {
            channelId: $channelId,
            channelEmail: $channelEmail,
            videoId: $videoId,
            videoThumbnail: $videoThumbnail,
            videoURL: $videoURL,
          }) {
            channelId,
            channelEmail,
            videoId,
            videoThumbnail,
            videoURL,
          }
        }
      `,
      variables: {
        channelId: this.channel.data.findChannel[0].id,
        channelEmail: this.channel.data.findChannel[0].email,
        videoId: this.currVid.videoId, 
        videoThumbnail: this.currVid.videoThumbnail,
        videoURL: this.currVid.videoURL,
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  removeDislike(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation remove($channelId: Int!, $videoId: Int!) {
          removeDislike(channelId: $channelId, videoId: $videoId)
        }
      `,
      variables: {
        channelId: this.channel.data.findChannel[0].id,
        videoId: this.currVid.videoId
      },
      refetchQueries: [{
        query: this.getVideoQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe()
  }

  checkLiked(): void {
    this.apollo.query<any>({
      query: gql`
      query find ($channelEmail: String!, $channelId: Int!){
        findLike(email: $channelEmail, videoId: $channelId) {
          channelId,
          channelEmail,
          videoId,
          videoThumbnail,
          videoURL,
        }
      }
      `,
      variables: {
        channelEmail: this.user.email,
        channelId: this.id
      }
    }).subscribe( result => {
      if(result.data.findLike.length > 0){
        this.isLiked = true
        this.paintBlue('.like')
      }
      else if(result.data.findLike.length == 0){
        this.isLiked = false
        this.paintGrey('.like')
      }
    })
  }

  checkDisliked(): void {
    this.apollo.query<any>({
      query: gql`
      query find ($channelEmail: String!, $channelId: Int!){
        findDislike(email: $channelEmail, videoId: $channelId) {
          channelId,
          channelEmail,
          videoId,
          videoThumbnail,
          videoURL,
        }
      }
      `,
      variables: {
        channelEmail: this.user.email,
        channelId: this.id
      }
    }).subscribe( result => {
      if(result.data.findDislike.length > 0) {
        this.isDisliked = true
        this.paintBlue('.dislike')
      }
      else if(result.data.findDislike.length == 0) {
        this.isDisliked = false
        this.paintGrey('.dislike')
      }
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
            isPremium
          }
        }
      `,
      variables: {
        email: this.currVid.channelEmail
      },
    }).subscribe( channel => {
        this.channel = channel;
    })
  }

  fetchVideos(): void {
    this.apollo.watchQuery<any>({
      query: this.getVideoQuery
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
      
      this.activatedRoute.paramMap.subscribe(params => {
        this.id = params.get('id');
        this.currVid = this.videos.find( v => v.videoId == this.id)
        this.convertDate();
        this.fetchUser();
        this.sortVideos();
        this.processVideos();
      })
    })
  }

 fetchComments(): void {
   this.apollo.watchQuery<any>({
     query: this.getCommentQuery,
     variables:{
       videoId: this.id
     }
   }).valueChanges.subscribe(result => {
     console.log('jalan')
     console.log(result)
     this.comments = result.data.comments
     this.commentQty = result.data.comments.length
     this.processComments()
   })
 }

  convertDate(): void {
    if(parseInt(this.currVid.uploadMonth) == 1)
      this.month = 'Jan'
    else if(parseInt(this.currVid.uploadMonth) == 2)
      this.month = 'Feb'
    else if(parseInt(this.currVid.uploadMonth) == 3)
      this.month = 'Mar'
    else if(parseInt(this.currVid.uploadMonth) == 4)
      this.month = 'Apr'
    else if(parseInt(this.currVid.uploadMonth) == 5)
      this.month = 'May'
    else if(parseInt(this.currVid.uploadMonth) == 6)
      this.month = 'Jun'
    else if(parseInt(this.currVid.uploadMonth) == 7)
      this.month = 'Jul'
    else if(parseInt(this.currVid.uploadMonth) == 8)
      this.month = 'Aug'
    else if(parseInt(this.currVid.uploadMonth) == 9)
      this.month = 'Sep'
    else if(parseInt(this.currVid.uploadMonth) == 10)
      this.month = 'Oct'
    else if(parseInt(this.currVid.uploadMonth) == 11)
      this.month = 'Nov'
    else if(parseInt(this.currVid.uploadMonth) == 12)
      this.month = 'Dec'
    
    this.post = this.month + ' ' + this.currVid.uploadDay + ', ' + this.currVid.uploadYear
  }

  sortVideos(): void {
    this.videos.sort(function(a,b) {return a.videoId - b.videoId})
  }

  processVideos(): void {
    var j = 0;
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId > this.id) {
        this.passVideos[j] = this.videos[i];
        j++;
      }
    }

    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId < this.id) {
        this.passVideos[j] = this.videos[i];
        j++;
      }
    }

    this.firstVideo[0] = this.passVideos[0]
    this.passVideos.shift()
  }

  processComments(): void {
    let j = 0
    for(let i = 0; i < this.comments.length; i++) {
      if(this.comments[i].replyTo == 0) {
        this.showComments[j] = this.comments[i]
        j++
      }
    }
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
        videoId: this.id,
        channelId: this.channel.data.findChannel[0].id,
        channelName: this.user.name,
        channelEmail: this.user.email,
        channelPhotoURL: this.user.photoUrl,
        content: this.content,
        replyTo: 0,
        likes: 0,
        dislikes: 0,
        day: this.d,
        month: this.m,
        year: this.y,
        replies: 0
      },
      refetchQueries: [{
        query: this.getCommentQuery,
        variables: {
          videoId: this.id
        }
      }],
    }).subscribe()
  }
}
