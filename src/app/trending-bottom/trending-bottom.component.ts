import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trending-bottom',
  templateUrl: './trending-bottom.component.html',
  styleUrls: ['./trending-bottom.component.scss']
})
export class TrendingBottomComponent implements OnInit {

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
    time: number
  }

  post: string = ' '
  day: any
  month: any
  year: any
  date: any
  desc: string = ''
  views: string = ''

  ngOnInit(): void {
    this.date = new Date()
    this.day = this.date.getDate()
    this.month = this.date.getMonth()
    this.year = this.date.getFullYear()
    this.processPost()
    this.processDesc()
    this.processViews()
  }

  processDesc(): void {
    this.desc = ''
    if(this.video.videoDesc.length >= 200) {
      for(let i = 0; i < 190; i++) {
        this.desc += this.video.videoDesc.charAt(i)
      }
      this.desc += '..'
    }
    else {
      this.desc = this.video.videoDesc
    }
  }

  processPost(): void {
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
      if(gap >= 7)
      {
        if(gap >= 7 && gap < 14)
          this.post = '1 week ago'
        else if(gap >= 14 && gap < 21)
          this.post = '2 weeks ago'
        else if(gap >= 21 && gap < 28)
          this.post = '3 weeks ago'
        else if(gap >= 28)
          this.post = '4 weeks ago'
      }
      else 
      {
        if(gap == 0)
          this.post = 'Today';
        else if(gap == 1)
          this.post = gap + ' day ago';
        else
          this.post = gap + ' days ago';
      }
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
