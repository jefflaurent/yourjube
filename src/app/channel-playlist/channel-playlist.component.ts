import { Component, OnInit, Input } from '@angular/core';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';

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

  currPlaylistVideo: PlaylistVideos[] = []

  constructor(private playlistVideoService: PlaylistVideoService) { }

  updated: string

  ngOnInit(): void { 
    this.playlistVideoService.fetchPlaylistVideosById(this.playlist.playlistId).valueChanges.subscribe( result => {
      console.log(result)
      this.currPlaylistVideo = result.data.playlistVideosById
    })

    var date = new Date()
    if(date.getDate() == this.playlist.lastDate && date.getMonth() == this.playlist.lastMonth && date.getFullYear() == this.playlist.lastYear)
      this.updated = 'Last updated today'
    else
    {
      var month
      if(this.playlist.lastMonth == 1)
        month = 'January'
      else if(this.playlist.lastMonth == 2)
        month = 'February'
      else if(this.playlist.lastMonth == 3)
        month = 'March'
      else if(this.playlist.lastMonth == 4)
        month = 'April'
      else if(this.playlist.lastMonth == 5)
        month = 'May'
      else if(this.playlist.lastMonth == 6)
        month = 'June'
      else if(this.playlist.lastMonth == 7)
        month = 'July'
      else if(this.playlist.lastMonth == 8)
        month = 'August'
      else if(this.playlist.lastMonth == 9)
        month = 'September'
      else if(this.playlist.lastMonth == 10)
        month = 'October'
      else if(this.playlist.lastMonth == 11)
        month = 'November'
      else if(this.playlist.lastMonth == 12)
        month = 'December'

      this.updated = 'Last updated on ' + this.playlist.lastDate + ' ' + month + ', ' + this.playlist.lastYear;
    }
  }

}
