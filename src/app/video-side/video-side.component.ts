import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-side',
  templateUrl: './video-side.component.html',
  styleUrls: ['./video-side.component.scss']
})
export class VideoSideComponent implements OnInit {
  @Input('vid') video: {
    videoId: number,        
    videoTitle: string,  
    videoDesc: string,
    videoURL: string,
    videoThumbnail: string,
    uploadDay: string,
    uploadMonth: string,
    uploadYear: string,
    views: number,
    likes: number,     
    dislikes: number,      
    visibility: string,    
    viewer: string,       
    category: string,      
    channelName: string,
    channelPhotoURL: string,
    channelEmail: string,
  }

  title : string = ''
  time : Date
  date : any
  month : any
  year : any
  views: any
  post : string


  constructor() { }

  ngOnInit(): void {
    this.processViews()

    if(this.video.videoTitle.length >= 60) {
      for(let i = 0; i < 50; i++) {
        this.title += this.video.videoTitle.charAt(i)
      }
      this.title += '..'
    }
    else {
      this.title = this.video.videoTitle
    }

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

  processViews(): void {
    if(this.video.views >= 1000 && this.video.views < 10000) {
      var front = Math.floor(this.video.views / 1000) 
      var rest = this.video.views - front
      var back = Math.floor(rest / 100)
      this.views = front + '.' + back + 'K'
    }
    else if(this.video.views >= 10000 && this.video.views <= 100000) {
      this.views = Math.floor(this.video.views / 1000) + 'K'
    }
    else if(this.video.views >= 1000000) {
      var front = Math.floor(this.video.views / 1000000)
      var rest = this.video.views - front
      var back = Math.floor(rest / 100000)
      this.views = front + '.' + back + 'M' 
    }
    else {
      this.views = this.video.views + ''
    }
  }
}
