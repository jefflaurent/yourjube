import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { Channel } from '../model/channel';

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

  playlistVideos: PlaylistVideos[] = []
  posterChannel: Channel
  description: string

  constructor(private userService: UserService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(): void {
    this.playlistVideoService.fetchPlaylistVideosById(this.playlist.playlistId).valueChanges.subscribe( result => {
      this.playlistVideos = result.data.playlistVideosById
    })

    this.description = ''
    if(this.playlist.playlistDescription.length > 50) {
      for(let i = 0; i < 47; i++) {
        this.description += this.playlist.playlistDescription.charAt(i)
      }
    }
    else {
      this.description = this.playlist.playlistDescription
    }

    this.userService.getUser(this.playlist.channelEmail).valueChanges.subscribe( result => {
      this.posterChannel = result.data.findChannel[0]
    })
  }

}
