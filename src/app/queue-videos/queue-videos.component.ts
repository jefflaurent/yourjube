import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-queue-videos',
  templateUrl: './queue-videos.component.html',
  styleUrls: ['./queue-videos.component.scss']
})
export class QueueVideosComponent implements OnInit {

  @Input('vid') video: {
    videoId: number       
    videoTitle: string
    videoDesc: string
    videoURL: string
    videoThumbnail: string
    uploadDay: string
    uploadMonth: string
    uploadYear: string
    views: number
    likes: number  
    dislikes: number    
    visibility: string   
    viewer: string     
    category: string      
    channelName: string
    channelPhotoURL: string
    channelEmail: string
    time: number
  }

  channel: Channel

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.video.channelEmail).valueChanges.subscribe( result => {
      this.channel = result.data.findChannel[0]
    })
  }

}
