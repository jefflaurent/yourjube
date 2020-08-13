import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../data-service/user-service';
import { VideoService } from '../data-service/video-service';
import { PlaylistService } from '../data-service/playlist-data';
import { Videos } from '../model/video';
import { Channel } from '../model/channel';
import { Playlists } from '../model/playlist';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(private userService: UserService, private videoService: VideoService, private playlistService: PlaylistService, private activatedRoute: ActivatedRoute) { }

  query: string
  videos: Videos [] = []
  allVideos: Videos [] = []
  channels: Channel[] = []
  playlists: Playlists[] = []
  
  showVideos: boolean
  showChannels: boolean
  showPlaylists: boolean

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      this.query = params.get('query')

      this.videoService.searchVideo(this.query).valueChanges.subscribe( result => {
        this.allVideos = result.data.searchVideo
        this.videos = result.data.searchVideo
      })

      this.userService.searchUser(this.query).valueChanges.subscribe( result => {
        this.channels = result.data.searchChannel
      })

      this.playlistService.searchPlaylist(this.query).valueChanges.subscribe( result => {
        this.playlists = result.data.searchPlaylist
      })

      setTimeout( ()=> {
        if(this.allVideos.length == 0 && this.playlists.length == 0 && this.channels.length != 0) {
          this.showVideos = false
          this.showChannels = true
          this.showPlaylists = false
        }
        else if(this.allVideos.length == 0 && this.playlists.length != 0 && this.channels.length == 0) {
          this.showVideos = false
          this.showChannels = false
          this.showPlaylists = true
        }
        else if(this.allVideos.length != 0 && this.playlists.length == 0 && this.channels.length == 0) {
          this.showVideos = true
          this.showChannels = false
          this.showPlaylists = false
        }
        else {
          this.showVideos = true
          this.showChannels = false
          this.showPlaylists = false
        }
      },1000)
    })
  }

  showFilters(): void {
    var x = document.querySelector('.filter-choice')
    x.classList.toggle('hidden')
  }

  switchToVideos(): void {
    this.showVideos = true
    this.showChannels = false
    this.showPlaylists = false
  }

  switchToPlaylist(): void {
    this.showVideos = false
    this.showChannels = false
    this.showPlaylists = true
  }

  switchToChannels(): void {
    this.showVideos = false
    this.showChannels = true
    this.showPlaylists = false
  }

  filterThisWeek(): void {
    var date = new Date()
    var currTime = date.getTime()
    let j = 0
    this.videos = []
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time <= 604800000) {
        this.videos[j] = this.allVideos[i]
        j++ 
      }
    }
  }

  filterThisMonth(): void {
    var date = new Date()
    var currTime = date.getTime()
    let j = 0
    this.videos = []
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time <= 2678400000) {
        this.videos[j] = this.allVideos[i]
        j++ 
      }
    }
  }

  filterThisYear(): void {
    var date = new Date()
    var currTime = date.getTime()
    let j = 0
    this.videos = []
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time <= 31536000000) {
        this.videos[j] = this.allVideos[i]
        j++ 
      }
    }
  }
}
