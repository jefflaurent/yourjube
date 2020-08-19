import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.scss']
})
export class ChannelAboutComponent implements OnInit {

  @Input('chan') channel: {
    id: number
    name: string
    email: string
    photoURL: string
    bannerURL: string
    subscriber: number
    isPremium: string
    joinDate: number
    joinMonth: number
    joinYear: number
    channelDescription: string
    isMature: string
    twitter: string
    facebook: string
    instagram: string
    validPremium: number
  }

  m: string
  post: string
  totalViews: number
  allVideos: Videos[] = []
  channelVideos: Videos[] = []

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    this.totalViews = 0
    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.allVideos = result.data.videos
      this.countViews()
    })
    this.processDate()
  }

  countViews(): void {
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].channelEmail == this.channel.email)
        this.totalViews += this.allVideos[i].views
    }
  }

  processDate(): void {
    var date = new Date()
      if(this.channel.joinMonth == 1)
        this.m = 'Jan'
      else if(this.channel.joinMonth== 2)
        this.m = 'Feb'
      else if(this.channel.joinMonth == 3)
        this.m = 'Mar'
      else if(this.channel.joinMonth == 4)
        this.m = 'Apr'
      else if(this.channel.joinMonth == 5)
        this.m = 'May'
      else if(this.channel.joinMonth == 6)
        this.m = 'Jun'
      else if(this.channel.joinMonth == 7)
        this.m = 'Jul'
      else if(this.channel.joinMonth == 8)
        this.m = 'Aug'
      else if(this.channel.joinMonth == 9)
        this.m = 'Sep'
      else if(this.channel.joinMonth == 10)
        this.m = 'Oct'
      else if(this.channel.joinMonth == 11)
        this.m = 'Nov'
      else if(this.channel.joinMonth == 12)
        this.m = 'Dec'
      this.post = 'Joined ' + this.m + ' ' + this.channel.joinDate + ', ' + this.channel.joinYear
  }
}
