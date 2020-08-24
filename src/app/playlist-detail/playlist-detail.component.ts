import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
