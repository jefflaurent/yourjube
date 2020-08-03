import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { PlaylistVideos } from '../model/playlist-video';
import { Videos } from '../model/video'; 
import gql from 'graphql-tag';

@Injectable()
export class PlaylistVideoService{

    private messageSource = new BehaviorSubject<PlaylistVideos[]>([])
    currentPlaylistVideo = this.messageSource.asObservable()
    playlistVideos: PlaylistVideos[] = []
    user: any
    playlistId: any
    video: Videos
    videoId: any

    constructor(private apollo: Apollo) {}

    changePlaylist(newPlaylistVideo: PlaylistVideos[]): void {
      this.messageSource.next(newPlaylistVideo)
    }

    fetchPlaylistVideoQuery = gql`
        query getPlaylistVideo($channelEmail: String!) {
            playlistVideos(channelEmail: $channelEmail) {
                id,
                playlistId,
                videoId,
                videoName,
                videoThumbnail,
                videoURL,
                channelName,
                channelEmail,
                day,
                month,
                year,
            }
        }
    `;

    fetchPlaylistVideos(email: string) {
      return this.apollo.watchQuery<any>({
        query: this.fetchPlaylistVideoQuery,
        variables: {
          channelEmail: email
        }
      })
    }

    initiateAddPlaylistVideo(playlistId: any, video: Videos): void{
      this.addPlaylistVideo(playlistId, video);
    }

    addPlaylistVideo(playlistId: any, video: Videos): void {
      var x = JSON.parse(localStorage.getItem('users'))
      var date = new Date()
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
                $day: Int!,
                $month: Int!,
                $year: Int!,
            ) {
              addPlaylist(input:{
                playlistId: $playlistId,
                videoId: $videoId,
                videoName: $videoName,
                videoThumbnail: $videoThumbnail,
                videoURL: $videoURL,
                channelName: $channelName,
                channelEmail: $channelEmail,
                day: $day,
                month: $month,
                year: $year,
              }){
                id,
                playlistId,
                videoId,
                videoName,
                videoThumbnail,
                videoURL,
                channelName,
                channelEmail,
                day,
                month,
                year,
              }
            }
          `,
          variables: {
            playlistId: playlistId,
            videoId: video.videoId,
            videoName: video.videoTitle,
            videoThumbnail: video.videoThumbnail,
            videoURL: video.videoURL,
            channelName: video.channelName,
            channelEmail: video.channelEmail,
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
          },
          refetchQueries: [{
              query: this.fetchPlaylistVideoQuery,
              variables: {
                  channelEmail: x.email
              }
          }]
      }).subscribe( result=> {
        console.log(result)
      })
    }

    removePlaylistVideo(playlistId: any, videoId: any): void {
      var x = JSON.parse(localStorage.getItem('users'))
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
            videoId: videoId,
            playlistId: playlistId,
          },
          refetchQueries: [{
              query: this.fetchPlaylistVideoQuery,
              variables: {
                channelEmail: x.email
              }
          }]
      }).subscribe()
    }

    clearPlaylist(playlistId: any): void {
      var x = JSON.parse(localStorage.getItem('users'))
      this.apollo.mutate({
        mutation: gql`
          mutation clearPlaylist($playlistId: Int!) {
            clearPlaylist(playlistId: $playlistId)
          }
        `,
        variables: {
          playlistId: playlistId
        },
        refetchQueries: [{
          query: this.fetchPlaylistVideoQuery,
          variables: {
            channelEmail: x.email
          }
        }]
      }).subscribe()
    }
}