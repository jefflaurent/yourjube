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
                time,
                place,
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

    fetchPlaylistVideoById(playlistId: number) {
      return this.apollo.watchQuery<any>({
        query: gql`
          query playlistVideosById($playlistId: Int!) {
            playlistVideosById(playlistId: $playlistId) {
              id,
              playlistId,
              videoId,
              videoName,
              videoThumbnail,
              videoURL,
              channelName,
              channelEmail,
              time,
              place,
          }
        `,
        variables: {
          playlistId: playlistId
        }
      })
    }

    initiateAddPlaylistVideo(playlistId: any, video: Videos, time: any, place: any): void{
      this.addPlaylistVideo(playlistId, video, time, place);
    }

    addPlaylistVideo(playlistId: any, video: Videos, time: any, place: any): void {
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
                $time: Int!,
                $place: Int!
            ) {
              addPlaylist(input:{
                playlistId: $playlistId,
                videoId: $videoId,
                videoName: $videoName,
                videoThumbnail: $videoThumbnail,
                videoURL: $videoURL,
                channelName: $channelName,
                channelEmail: $channelEmail,
                time: $time,
                place: $place,
              }){
                id,
                playlistId,
                videoId,
                videoName,
                videoThumbnail,
                videoURL,
                channelName,
                channelEmail,
                time,
                place,
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
            time: time,
            place: place,
          },
          refetchQueries: [{
              query: this.fetchPlaylistVideoQuery,
              variables: {
                  channelEmail: x.email
              }
          }]
      }).subscribe()
    }

    addPlaylistVideo2(playlistId: any, playlistVideo: PlaylistVideos, place: any) {
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
                $time: Int!,
            ) {
              addPlaylist(input:{
                playlistId: $playlistId,
                videoId: $videoId,
                videoName: $videoName,
                videoThumbnail: $videoThumbnail,
                videoURL: $videoURL,
                channelName: $channelName,
                channelEmail: $channelEmail,
                time: $time,
                place: $place,
              }){
                id,
                playlistId,
                videoId,
                videoName,
                videoThumbnail,
                videoURL,
                channelName,
                channelEmail,
                time,
                place,
              }
            }
          `,
          variables: {
            playlistId: playlistId,
            videoId: playlistVideo.videoId,
            videoName: playlistVideo.videoName,
            videoThumbnail: playlistVideo.videoThumbnail,
            videoURL: playlistVideo.videoURL,
            channelName: playlistVideo.channelName,
            channelEmail: playlistVideo.channelEmail,
            time: playlistVideo.time,
            place: place
          },
          refetchQueries: [{
              query: this.fetchPlaylistVideoQuery,
              variables: {
                  channelEmail: x.email
              }
          }]
      }).subscribe()
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
        }
      }).subscribe()
    }

    updatePlace(playlistId: any, videoId: any, place: any) {
      var x = JSON.parse(localStorage.getItem('users'))
      this.apollo.mutate({
         mutation: gql`
          mutation updatePlaylistPlace($playlistId: Int!, $videoId: Int!, $place: Int!) {
            updatePlaylistPlace(playlistId: $playlistId, videoId: $videoId, place: $place)
          }
         `,
         variables: {
           playlistId: playlistId,
           videoId: videoId,
           place: place
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