import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
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
    place: number,
  }

  currPlaylist: Playlists
  allPlaylists: Playlists[] = []
  playlistVideos: PlaylistVideos[] = []
  playlistVideosTemp: PlaylistVideos[] = []
  dummyId: any

  constructor(private playlistService: PlaylistService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(): void {

    this.dummyId = 'pv' + this.playlistVideo.playlistId + this.playlistVideo.videoId
    this.playlistService.fetchAllPlaylist().valueChanges.subscribe( allPlaylist => {
      this.allPlaylists = allPlaylist.data.allPlaylists
      this.currPlaylist = this.allPlaylists.find( p => p.playlistId == this.playlistVideo.playlistId)
    })
    this.playlistVideoService.fetchPlaylistVideos(this.playlistVideo.channelEmail).valueChanges.subscribe( result => {
      this.playlistVideosTemp = result.data.playlistVideos
      this.filterVideos()
    })
  } 

  filterVideos(): void {
    this.playlistVideos = []
    let j = 0;
    for(let i = 0; i < this.playlistVideosTemp.length; i++){
      if(this.playlistVideosTemp[i].playlistId == this.playlistVideo.playlistId) {
        this.playlistVideos[j] = this.playlistVideosTemp[i];
        j++;
      }
    }
    this.playlistVideos.sort((a,b) => (a.place < b.place) ? -1 : 1)
    console.log(this.playlistVideos)
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

  moveToTop(): void {
    this.playlistService.updateThumbnail(this.playlistVideo.playlistId, this.playlistVideo.videoThumbnail)
    var tempTop = this.playlistVideos[0].place
    this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideos[0].videoId, this.playlistVideo.place)
    this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideo.videoId, tempTop)
  }

  moveToBot(): void {
    if(this.playlistVideo.place == 1) {
      this.playlistService.updateThumbnail(this.playlistVideo.playlistId, this.playlistVideos[this.playlistVideos.length-1].videoThumbnail)
    }
    var tempTop = this.playlistVideos[this.playlistVideos.length-1].place
    this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideos[this.playlistVideos.length-1].videoId, this.playlistVideo.place)
    this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideo.videoId, tempTop)
  }
}
