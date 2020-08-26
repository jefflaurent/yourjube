import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {

  @Input('play') playlistVideo: {
    id: number
    playlistId: number
    videoId: number
    videoName: string
    videoThumbnail: string 
    videoURL: string
    channelName: string
    channelEmail: string
    time: number
    place: number
  }

  channel: Channel
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.playlistVideo.channelEmail).valueChanges.subscribe( result => {
      this.channel = result.data.findChannel[0]
    })
  }
}
