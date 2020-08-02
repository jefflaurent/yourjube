import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-playlist-side',
  templateUrl: './playlist-side.component.html',
  styleUrls: ['./playlist-side.component.scss']
})
export class PlaylistSideComponent implements OnInit {

  @Input('play') playlistVideo: {
    id: BigInteger,
    playlistId: BigInteger,
    videoId: BigInteger,
    videoName: string,
    videoThumbnail: string,
    videoURL: string,
    channelName: string,
    channelEmail: string,
  }

  constructor() { }

  ngOnInit(): void {
  }
}
