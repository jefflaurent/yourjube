import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { Playlists } from '../model/playlist';
import { UserService } from '../data-service/user-service';
import { Channel } from '../model/channel';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

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
  posterChannel: Channel
  dummyId: any
  video: Videos
  views: string
  description: string
  post: string

  constructor(private playlistService: PlaylistService, private playlistVideoService: PlaylistVideoService, private status: PlaylistModalInfo, private videoService: VideoService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser(this.playlistVideo.channelEmail).valueChanges.subscribe( result => {
      this.posterChannel = result.data.findChannel[0]
    })

    this.videoService.findVideo(this.playlistVideo.videoId).valueChanges.subscribe( result => {
      this.video = result.data.findVideo[0]
      this.processViews()
      this.processDesc()
      this.processPost()
    })

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

  processViews(): void {
    if(this.video.views >= 1000 && this.video.views < 10000) {
      var front = Math.floor(this.video.views / 1000) 
      var rest = this.video.views - front
      var back = Math.floor(rest / 100)
      this.views = front + '.' + back + 'K'
    }
    else if(this.video.views >= 10000 && this.video.views <= 100000) {
      this.views = Math.floor(this.video.views / 1000) + 'K'
    }
    else if(this.video.views >= 1000000) {
      var front = Math.floor(this.video.views / 1000000)
      var rest = this.video.views - front
      var back = Math.floor(rest / 100000)
      this.views = front + '.' + back + 'M' 
    }
    else {
      this.views = this.video.views + ''
    }
  }

  processPost(): void {
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.video.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 0)
          this.post = 'Today'
        if(count == 1)
          this.post = count + ' day ago'
        else
          this.post = count + ' days ago'
      }
      else if(gap >= 604800000) {
        if(gap >= 604800000 && gap < 1209600000)
          this.post = '1 week ago'
        else if(gap >= 1209600000 && gap < 1814400000)
          this.post = '2 weeks ago'
        else if(gap >= 1814400000 && gap < 2419200000)
          this.post = '3 weeks ago'
        else if(gap >= 2419200000)
          this.post = '4 weeks ago'
      }
    }
    else if(gap < 30758400000) {
      count = gap / 2678400000
      count = Math.floor(count)

      if(count == 1)
        this.post = count + ' month ago'
      else
        this.post = count + ' months ago'
    }
    else {
      count = gap / 30758400000
      count = Math.floor(count)
      
      if(gap == 1) 
        this.post = gap + ' year ago';
      else
        this.post = gap + ' years ago';
    }
  }

  processDesc(): void {
    if(this.video.videoDesc.length < 70) {
      this.description = this.video.videoDesc
    }
    else {
      this.description = ''
      for(let i = 0; i < 67; i++) {
        this.description += this.video.videoDesc.charAt(i)
      }
      this.description += '...'
    }
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
  }

  toggleModal(): void {
    var query = '#' + this.dummyId
    let btn = document.querySelector(query)
    btn.classList.toggle('hidden')
  }

  addQueue(): void {
    var arr = []
    if(localStorage.getItem('queue') != null) {
      arr = JSON.parse(localStorage.getItem('queue'))
      arr.push(this.playlistVideo.videoId)
      localStorage.setItem('queue', JSON.stringify(arr))
    }
    else {
      arr.push(this.playlistVideo.videoId)
      localStorage.setItem('queue', JSON.stringify(arr))
      arr = JSON.parse(localStorage.getItem('queue'))
    }
  }
  
  showPlaylist(): void {
    this.toggleModal()
    var y = ((this.video.videoId as unknown) as Uint8Array) 
    this.playlistService.changeVideo(y)
    this.status.changeStatus(true)
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

  findCurrIndex(videoId: number): number {
    for(let i = 0; i < this.playlistVideos.length; i++) {
      if(videoId == this.playlistVideos[i].videoId)
        return i
    }
  }

  swapToTop(): void {
    var index = this.findCurrIndex(this.playlistVideo.videoId)
    var temp = this.playlistVideo.place
    if(this.playlistVideo.place != 1) {
      this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideo.videoId, index)
      this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideos[index-1].videoId, temp)

      if(index == 1)
        this.playlistService.updateThumbnail(this.playlistVideo.playlistId, this.playlistVideo.videoThumbnail)
    }
  }

  swapToBot(): void {
    var index = this.findCurrIndex(this.playlistVideo.videoId)
    var temp = this.playlistVideo.place
    if(this.playlistVideo.place != this.playlistVideos.length) {
      this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideo.videoId, index+2)
      this.playlistVideoService.updatePlace(this.playlistVideo.playlistId, this.playlistVideos[index+1].videoId, temp)
    }
  }
}
