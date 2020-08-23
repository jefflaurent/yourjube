import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { PlaylistService } from '../data-service/playlist-data';
import { UserService } from '../data-service/user-service';
import { Videos } from '../model/video';
import { Playlists } from '../model/playlist';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit {

  @Input('chan') channel: {
    id: number
    name: string
    email: string
    photoURL: string
    bannerURL: string
    subscriber: number
    isPremium: string
  }

  @Output() moveEvent = new EventEmitter<string>();

  moveTo: string
  allVideos: Videos[] = []
  videos: Videos[] = []
  showVideos: Videos[] = []
  allPlaylists: Playlists[] = []
  playlists: Playlists[] = []
  showPlaylists: Playlists[] = []

  constructor(private videoService: VideoService, private playlistService: PlaylistService, private userService: UserService) { }
  
  ngOnInit(): void {
    this.allVideos = []
    this.videos = []

    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.allVideos = result.data.videos
      this.filterVideos()
    })

    this.playlistService.fetchAllPlaylist().valueChanges.subscribe( result => {
      this.allPlaylists = result.data.allPlaylists
      this.filterPlaylist()
    })
  }

  moveToVideos(): void {
    this.moveTo = 'videos'
    this.moveEvent.emit(this.moveTo)
  }

  filterVideos(): void {
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].channelEmail == this.channel.email) {
        this.videos[j] = this.allVideos[i];
        j++;
        this.videos.sort((a,b) => (a.time > b.time) ? -1 : 1)
      }
    }
    this.getRandomVideos()
  }

  filterPlaylist(): void {
    let j = 0
    for(let i = 0; i < this.allPlaylists.length; i++) {
      if(this.allPlaylists[i].channelEmail == this.channel.email) {
        this.playlists[j] = this.allPlaylists[i];
        j++;
      }
    }
    this.getRandomPlaylist()
  }

  randomIndex(length: number): number {
    let randomIdx = 0

    randomIdx = Math.random() * (length - 0) + 0
    return Math.floor(randomIdx)
  }

  getRandomVideos(): void {
    let check: number[] = []
    for(let i = 0; i < this.videos.length; i++)
      check[i] = -1;
    let count = 0;
    let idx = 0;
    let x = 0
    while(count < 5)
    {
      if(this.videos.length <= x)
        break;
      idx = this.randomIndex(this.videos.length)
      if(check[idx] == -1) {
        this.showVideos[count] = this.videos[idx]
        check[idx]++
        count++
      } 
      x++
    }
  }

  getRandomPlaylist(): void {
    let check: number[] = []
    for(let i = 0; i < this.playlists.length; i++)
      check[i] = -1;
    let count = 0;
    let idx = 0;
    let x = 0;
    while(count < 3)
    {
      if(this.playlists.length <= x)
        break;
      idx = this.randomIndex(this.playlists.length)
      if(check[idx] == -1 && (this.playlists[idx].visibility == 'public' || this.playlists[idx].visibility == 'Public')) {
        this.showPlaylists[count] = this.playlists[idx]
        check[idx]++
        count++
      }
      x++;
    }
  }
}
