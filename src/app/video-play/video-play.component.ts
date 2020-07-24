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
  id : any
  month: any
  post: string
  channel: any = null
  isLimited : boolean = true

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchVideos();
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
    document.getElementById('#shrinkBtn').style.display = 'none';
    document.getElementById('#expandBtn').style.display = 'block';
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
      }
    }).subscribe( channel => {
        this.channel = channel;
        this.getElements();
    })
  }

  fetchVideos(): void {
    this.apollo.query<any>({
      query: gql`
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
      `
    }).subscribe(result => {
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
