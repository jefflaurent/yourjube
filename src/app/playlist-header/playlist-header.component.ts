import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-playlist-header',
  templateUrl: './playlist-header.component.html',
  styleUrls: ['./playlist-header.component.scss']
})

export class PlaylistHeaderComponent implements OnInit {

  @Input('play') playlist: {
    playlistId: BigInteger,
    playlistName: string,
    playlistThumbnail: string,
    playlistDescription: string,
    channelEmail: string,
    lastDate: BigInteger,
    lastMonth: BigInteger,
    lastYear: BigInteger,
    videoCount: BigInteger,
    views: BigInteger,
    visibility: string,
  }

  constructor() { }

  ngOnInit(): void {
  }
}
