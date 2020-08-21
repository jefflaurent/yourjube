import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-channel-studio',
  templateUrl: './channel-studio.component.html',
  styleUrls: ['./channel-studio.component.scss']
})
export class ChannelStudioComponent implements OnInit {

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

  constructor(private videoService: VideoService) { }
  
  allVideos: Videos[] = []
  channelVideos: Videos[] = []

  ngOnInit(): void {
    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.allVideos = result.data.videos
      this.filterVideos()
    })
  }

  filterVideos(): void {
    var j = 0;
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].channelEmail == this.channel.email) {
        this.channelVideos[j] = this.allVideos[i]
        j++
      }
    }
  }
}
