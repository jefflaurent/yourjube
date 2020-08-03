import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { Playlists } from '../model/playlist';

@Component({
  selector: 'app-playlist-side',
  templateUrl: './playlist-side.component.html',
  styleUrls: ['./playlist-side.component.scss']
})
export class PlaylistSideComponent implements OnInit {

  @Input('play') playlistVideo: {
    id: number,
    playlistId: number,
    videoId: number,
    videoName: string,
    videoThumbnail: string,
    videoURL: string,
    channelName: string,
    channelEmail: string,
  }

  allPlaylists: Playlists[] = []
  currPlaylist: Playlists
  dummyId: any

  constructor(private playlistService: PlaylistService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(): void {
    this.dummyId = 'pv' + this.playlistVideo.playlistId + this.playlistVideo.videoId
    this.playlistService.fetchAllPlaylist().valueChanges.subscribe( allPlaylist => {
      this.allPlaylists = allPlaylist.data.allPlaylists
      this.currPlaylist = this.allPlaylists.find( p => p.playlistId == this.playlistVideo.playlistId)
    })
  } 

  toggleModal(): void {
    var query = '#' + this.dummyId
    let btn = document.querySelector(query)
    btn.classList.toggle('hidden')
  }

  addQueue(): void {
    console.log('dia pencet queue')
  }
  
  addPlaylist(): void {
    console.log('dia pencet playlist')
  }

  removeVideo(): void {
    this.playlistVideoService.removePlaylistVideo(this.playlistVideo.playlistId, this.playlistVideo.videoId)
    this.playlistService.decreaseVideoCount(this.playlistVideo.playlistId)
  }
}
