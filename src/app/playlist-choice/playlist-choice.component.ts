import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../data-service/playlist-data'; 
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

  video: Videos[] = []
  dummyId: any
  empty: any = " "
  clicked: boolean
  videoId: any
  constructor(private data: PlaylistService, private apollo: Apollo) {  }

  ngOnInit(): void {
    this.data.currentVideo.subscribe( videoId => this.videoId = videoId)
    this.dummyId = 'choice-play' + this.playlist.playlistId + this.videoId
    this.findVideo()
    this.validateVideo()
  }

  toggleColor(): void {
    if(this.clicked == false) {
      this.paintBlue()
      this.addVideo()
      this.clicked = true
    }
    else {
      this.paintWhite()
      this.removeVideo()
      this.clicked = false
    }
  }

  paintBlue(): void {
    var query = '#' + this.dummyId
    var x = document.querySelector(query)
    console.log(query)
    x.classList.add('clicked')
  }

  paintWhite(): void {
    var query = '#' + this.dummyId
    var x = document.querySelector(query)
    console.log(query)
    x.classList.remove('clicked')
  }

  addVideo(): void{
    this.apollo.mutate({
      mutation: gql`
        mutation addPlaylist(
            $playlistId: Int!,
            $videoId: Int!,
            $videoName: String!,
            $videoThumbnail: String!,
            $videoURL: String!,
            $channelName: String!,
            $channelEmail: String!,
        ) {
          addPlaylist(input:{
            playlistId: $playlistId,
            videoId: $videoId,
            videoName: $videoName,
            videoThumbnail: $videoThumbnail,
            videoURL: $videoURL,
            channelName: $channelName,
            channelEmail: $channelEmail,
          }){
            id,
            playlistId,
            videoId,
            videoName,
            videoThumbnail,
            videoURL,
            channelName,
            channelEmail,
          }
        }
      `,
      variables: {
        playlistId: this.playlist.playlistId,
        videoId: this.videoId,
        videoName: this.video[0].videoTitle,
        videoThumbnail: this.video[0].videoThumbnail,
        videoURL: this.video[0].videoURL,
        channelName: this.video[0].channelName,
        channelEmail: this.video[0].channelEmail,
      }
    }).subscribe( result => {
      console.log(result)
    })
  }

  removeVideo(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation removeVideo(
          $videoId: Int!,
          $playlistId: Int!,
        ) {
          removePlaylistVideo(
            videoId: $videoId,
            playlistId: $playlistId,
          )
        }
      `,
      variables: {
        videoId: this.videoId,
        playlistId: this.playlist.playlistId
      }
    }).subscribe( result => {
      console.log(result)
    })
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

  validateVideo(): void {
    this.apollo.watchQuery<any>({
      query: gql`
        query findVideoPlaylist($playlistId: Int!, $videoId: Int!){
          findVideoPlaylist(playlistId: $playlistId, videoId: $videoId){
            id,
            playlistId,
            videoId,
            videoName,
            videoThumbnail,
            videoURL,
            channelName,
            channelEmail,
          } 
        }
      `,
      variables: {
        playlistId: this.playlist.playlistId,
        videoId: this.videoId
      }
    }).valueChanges.subscribe( result => {
      if(result.data.findVideoPlaylist.length == 0){
        this.clicked = false
        this.paintWhite()        
      }
      else{
        this.clicked = true
        this.paintBlue()
      }
    })
  }
}
