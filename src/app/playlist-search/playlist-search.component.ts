import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-playlist-search',
  templateUrl: './playlist-search.component.html',
  styleUrls: ['./playlist-search.component.scss']
})

export class PlaylistSearchComponent implements OnInit {

  @Input('play')playlist: {
    playlistId: number 
    playlistName: string
    playlistThumbnail: string
    playlistDescription: string
    channelEmail: string
    lastDate: number
    lastMonth: number
    lastYear: number
    videoCount: number
    views: number
    visibility: string
  }

  constructor() { }

  ngOnInit(): void {
  }

}
