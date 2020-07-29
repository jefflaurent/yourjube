import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-playlist-side',
  templateUrl: './playlist-side.component.html',
  styleUrls: ['./playlist-side.component.scss']
})
export class PlaylistSideComponent implements OnInit {

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

  time : Date
  date : any
  month : any
  year : any

  post : string


  constructor() { }

  ngOnInit(): void {

    this.time = new Date()
    this.date = this.time.getDate()
    this.month = this.time.getMonth()
    this.year = this.time.getFullYear()

    if(parseInt(this.video.uploadYear) < this.year) {
      let gap = this.year - parseInt(this.video.uploadYear) 
      if(gap == 1) 
        this.post = gap + ' year ago';
      else
        this.post = gap + ' years ago';
    }
    else if(parseInt(this.video.uploadYear) == this.year && parseInt(this.video.uploadMonth) < this.month) {
      let gap = this.month - parseInt(this.video.uploadMonth)
      if(gap == 1)
        this.post = gap + ' month ago';
      else 
        this.post = gap + ' months ago';
    }
    else if(parseInt(this.video.uploadYear) == this.year && parseInt(this.video.uploadMonth) == this.month && parseInt(this.video.uploadDay) <= this.date) {
      let gap = this.date - parseInt(this.video.uploadDay)
      if(gap == 0)
        this.post = 'Today';
      else if(gap == 1)
        this.post = gap + ' day ago';
      else
        this.post = gap + ' days ago';
    }
  }

}
