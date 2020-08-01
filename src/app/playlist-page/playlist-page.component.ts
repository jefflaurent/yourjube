import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Playlists } from '../model/playlist';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { PlaylistService } from '../data-service/playlist-data';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  playlistVideosTemp: PlaylistVideos[] = []
  playlistVideos: PlaylistVideos[] = []
  
  currPlaylist: Playlists
  playlists: Playlists[] = []
  playlistName: string = "Playlist #1"
  playlistDescription: string = "No Description"
  playlistId: any

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private data: PlaylistVideoService, private currData: PlaylistService) { }

  ngOnInit(): void {
    this.data.currentPlaylistVideo.subscribe( playlistVideo => {
      this.playlistVideosTemp = playlistVideo
    })

    this.currData.currentPlaylist.subscribe( playlist => {
      this.playlists = playlist
    })
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.playlistId = params.get('id');
    })

    this.filterVideos();
    this.currPlaylist = this.playlists.find( p => p.playlistId == this.playlistId)
  }

  filterVideos(): void {
    let j = 0;
    for(let i = 0; i < this.playlistVideosTemp.length; i++){
      if(this.playlistVideosTemp[i].playlistId == this.playlistId) {
        this.playlistVideos[j] = this.playlistVideosTemp[i];
        j++;
      }
    }
    console.log(this.playlistVideos)
  }

  hidePencil(): void {
    var x = document.querySelector('.editTitle')
    var y = document.querySelector('.title')
    var z = document.querySelector('.titleTxt')
    var a = document.querySelector('.title-btn')

    x.classList.add('none')
    y.classList.remove('hidden')
    z.classList.add('hidden')
    a.classList.remove('hidden')
  }

  returnTitle() {
    var x = document.querySelector('.editTitle')
    var y = document.querySelector('.title')
    var z = document.querySelector('.titleTxt')
    var a = document.querySelector('.title-btn') 

    x.classList.remove('none')
    y.classList.add('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

  hideDescPencil(): void {
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.remove('hidden')
    y.classList.add('hidden')
    z.classList.add('hidden')
    a.classList.remove('hidden')
  }

  returnDesc(): void {
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.add('hidden')
    y.classList.remove('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

}
