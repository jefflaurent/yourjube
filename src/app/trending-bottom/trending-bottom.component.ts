import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';

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
  channel: any

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('users'))
    this.userService.getUser(user.email).valueChanges.subscribe( result => {
      this.channel = result.data.findChannel[0]
    })
    
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
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.video.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 1)
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
