import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data'; 
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { Videos } from '../model/video';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-choice',
  templateUrl: './playlist-choice.component.html',
  styleUrls: ['./playlist-choice.component.scss']
})
export class PlaylistChoiceComponent implements OnInit {

  @Input('play') playlist: {
    playlistId: BigInteger 
    playlistName: string
    playlistThumbnail: string
    playlistDescription: string
    channelEmail: string
    lastDate: BigInteger
    lastMonth: BigInteger
    lastYear: BigInteger
    videoCount: BigInteger
    views: BigInteger
    visibility: string
  }

  playlistVideo: PlaylistVideos
  playlistVideos: PlaylistVideos[] = []
  video: Videos[] = []
  myId: string
  empty: any = " "
  clicked: boolean
  videoId: any

  constructor(private data: PlaylistService, private apollo: Apollo, private playlistData: PlaylistVideoService) {  }

  ngOnInit(): void {
    this.myId = "myId" + this.playlist.playlistId
    this.data.currentVideo.subscribe( videoId => this.videoId = videoId)
    this.playlistData.currentPlaylistVideo.subscribe( playlistVideos => {
      this.playlistVideos = playlistVideos
    })
    this.findVideo()
    this.validateVideo()
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
    this.playlistData.initiateAddPlaylistVideo(this.playlist.playlistId, this.video[0])
  }

  removeVideo(): void {
    this.playlistData.initiateRemovePlaylistVideo(this.playlist.playlistId, this.videoId)
  }

  validateVideo(): void {
    this.playlistVideo = null

    if(this.playlistVideos) {

      for(let i = 0; i < this.playlistVideos.length; i ++) {

        if(parseInt(this.playlistVideos[i].playlistId.toString()) == parseInt(this.playlist.playlistId.toString()) &&
        this.playlistVideos[i].videoId == this.videoId) {
          this.playlistVideo = this.playlistVideos[i];
          break;
        }
      }
  
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

  findVideo(): void {
    this.apollo.watchQuery<any>({
      query: gql`
        query getVideo($videoId: ID!){
          findVideo(videoId: $videoId){
            videoId,
            videoTitle,
            videoDesc,
            videoURL,
            videoThumbnail,
            uploadDay,
            uploadMonth,
            uploadYear,
            views,
            likes,
            dislikes,
            visibility,
            viewer,
            category,
            channelName,
            channelPhotoURL,
            channelEmail,
          }
        }
      `,
      variables: {
        videoId: this.videoId
      }
    }).valueChanges.subscribe( result => {
      this.video = result.data.findVideo
    })
  }
}
