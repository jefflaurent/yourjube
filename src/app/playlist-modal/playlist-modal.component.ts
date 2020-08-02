import { Component, OnInit } from '@angular/core';
import { Playlists } from '../model/playlist';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { PlaylistService } from '../data-service/playlist-data';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.scss']
})
export class PlaylistModalComponent implements OnInit {

  video: Videos
  videoId: any
  newId: any
  playlistName: string = ''
  visibility: string
  playlists: Playlists[] = []
  allPlaylists: Playlists[] = []
  status: boolean
  date: any
  channel: any
  constructor(private state: PlaylistModalInfo, private data: PlaylistService, private videoService: VideoService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(): void {
    this.channel = JSON.parse(localStorage.getItem('users'))
    this.data.fetchPlaylist(this.channel.email).valueChanges.subscribe( playlist => this.playlists = playlist.data.playlists)
    this.data.currentVideo.subscribe( videoId => {
      this.videoId = videoId
      this.videoService.findVideo(this.videoId).valueChanges.subscribe( video => {
        this.video = video.data.findVideo
      })
    })

    this.data.fetchAllPlaylist().valueChanges.subscribe( allPlaylists => {
      this.allPlaylists = allPlaylists.data.allPlaylists
      this.getNewId()
    })
 
    this.state.currentStatus.subscribe( status => this.status = status)
    this.date = new Date()
  }

  closeModal(): void {
    this.state.changeStatus(false)
  }

  createPlaylist(): void {
    var x = (<HTMLSelectElement>document.getElementById('visibilityOption'))
    this.visibility = x.options[x.selectedIndex].value;
    this.data.initiateCreatePlaylist(this.playlistName, this.visibility, this.video)
    this.playlistVideoService.initiateAddPlaylistVideo(this.newId, this.video[0])
  }

  openCreate(): void {
    var x = document.querySelector('.common-container')
    x.classList.remove('hidden')
  }

  getNewId(): void {
    this.newId = 0
    for(let i = 0; i < this.allPlaylists.length; i++) {
      if(this.newId < this.allPlaylists[i].playlistId)
        this.newId = this.allPlaylists[i].playlistId
    }
  }
}
