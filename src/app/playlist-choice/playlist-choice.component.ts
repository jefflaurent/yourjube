import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data'; 
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-playlist-choice',
  templateUrl: './playlist-choice.component.html',
  styleUrls: ['./playlist-choice.component.scss']
})
export class PlaylistChoiceComponent implements OnInit {

  @Input('play') playlist: {
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

  playlistVideo: PlaylistVideos
  playlistVideos: PlaylistVideos[] = []
  video: Videos
  myId: string
  user: any
  empty: any = " "
  clicked: boolean
  videoId: any
  videoPlace: any

  constructor(private data: PlaylistService, private playlistData: PlaylistVideoService, private videoService: VideoService) {  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'))
    this.myId = "myId" + this.playlist.playlistId
    
    this.data.currentVideo.subscribe( videoId => {
      this.videoId = parseInt(videoId.toString())
      
      this.videoService.findVideo(this.videoId).valueChanges.subscribe( result => {
        this.video = result.data.findVideo[0]
      })

      this.playlistData.fetchPlaylistVideos(this.user.email).valueChanges.subscribe( playlistVideos => {
        this.playlistVideos = playlistVideos.data.playlistVideos
        this.getVideoPlace()
        this.validateVideo()
      })
    })
  }

  paintBlue(): void {
    this.addVideo()
    this.clicked = true
  }

  paintWhite(): void {
    this.removeVideo()
    this.clicked = false
  }

  addVideo(): void{
    var date
    date = new Date()
    this.data.addVideoCount(this.playlist.playlistId)
    this.playlistData.addPlaylistVideo(this.playlist.playlistId, this.video, date.getTime(), this.videoPlace)
  }

  removeVideo(): void {
    this.playlistData.removePlaylistVideo(this.playlist.playlistId, this.videoId)
  }

  getVideoPlace(): void {
    this.videoPlace = 1
    for(let i = 0; i < this.playlistVideos.length; i++) {
      if(parseInt(this.playlistVideos[i].playlistId.toString()) == parseInt(this.playlist.playlistId.toString())) {
        this.videoPlace++;
      }
    }
  }

  validateVideo(): void {
    this.playlistVideo = null

    if(this.playlistVideos) {
      this.playlistVideo = this.playlistVideos.find(p => p.playlistId == ((this.playlist.playlistId as unknown) as number) 
      && p.videoId == this.videoId)
  
      if(this.playlistVideo == null) {
        this.clicked = false
      }
      else {
        this.clicked = true
      }
    }
    else {
      this.clicked = false
    }
  }
}
