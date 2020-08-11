import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-channel-playlist',
  templateUrl: './channel-playlist.component.html',
  styleUrls: ['./channel-playlist.component.scss']
})
export class ChannelPlaylistComponent implements OnInit {

  @Input('play') playlist: {
    playlistId: number,
    playlistName: string,
    playlistThumbnail: string,
    playlistDescription: string,
    channelEmail: string,
    lastDate: number,
    lastMonth: number,
    lastYear: number,
    videoCount: number,
    views: number,
    visibility: string,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
