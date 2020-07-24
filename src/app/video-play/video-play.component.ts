import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from'apollo-angular';
import { Videos } from '../video';
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


  @Input('vid') video: {
    videoId: BigInteger,        
    videoTitle: string,  
    videoDesc: string,
    videoURL: string,
    videoThumbnail: string,
    uploadDay: string,
    uploadMonth: string,
    uploadYear: string,
    views: BigInteger,
    likes: BigInteger,     
    dislikes: BigInteger,      
    visibility: string,    
    viewer: string,       
    category: string,      
    channelName: string,
    channelPhotoURL: string,
    channelEmail: string,
  }

  videos: Videos[] = [];
  currVid: Videos
  id: any
  month: any
  post: string
  channel: any = null
  isLimited: boolean = true
  isLiked: boolean
  isDisliked: boolean
  user : any

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchVideos();
    this.user = JSON.parse(localStorage.getItem('users'))
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.watchVideo();
      this.checkLiked()
      console.log(this.id)
      console.log(this.user.email)
    })
  }

  getElements() : void {
    var btnExpand = document.querySelector('#expandBtn')
    btnExpand.addEventListener('click', this.expandField)
    
    var btnShrink = document.querySelector('#shrinkBtn')
    btnShrink.addEventListener('click', this.shrinkField)
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

  initiateLike(): void {
    if(this.isLiked == false) {
      this.addLike()
      this.increaseLike()
      this.isLiked = true
      console.log(this.isLiked)
    } else if(this.isLiked == true){
      this.removeLike()
      this.decreaseLike()
      this.isLiked = false
      console.log(this.isLiked)
    }
  }

  // initiateDislike(): void {
  //   if(this.isDisliked == false) {
  //     this.addLike()
  //     this.increaseLike()
  //     this.isLiked = true
  //     console.log(this.isLiked)
  //   } else if(this.isDisliked == true){
  //     this.removeLike()
  //     this.decreaseLike()
  //     this.isLiked = false
  //     console.log(this.isLiked)
  //   }
  // }

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
      if(result.data.findLike.length > 0)
        this.isLiked = true
      else if(result.data.findLike.length == 0)
        this.isLiked = false
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
        this.getElements();
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
      
        this.fetchUser();
      })
    })
  }
}
