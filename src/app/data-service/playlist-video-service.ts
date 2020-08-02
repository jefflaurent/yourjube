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
      this.addPlaylistVideo(playlistId+1, video);
    }

    initiateRemovePlaylistVideo(playlistId: BigInteger, videoId: BigInteger): void {
        this.playlistId = playlistId;
        this.videoId = videoId;
        this.removePlaylistVideo();
    }

    addPlaylistVideo(playlistId: any, video: Videos): void {
      var x = JSON.parse(localStorage.getItem('users'))
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
            playlistId: playlistId,
            videoId: video.videoId,
            videoName: video.videoTitle,
            videoThumbnail: video.videoThumbnail,
            videoURL: video.videoURL,
            channelName: video.channelName,
            channelEmail: video.channelEmail,
          },
          refetchQueries: [{
              query: this.fetchPlaylistVideoQuery,
              variables: {
                  channelEmail: x.email
              }
          }]
      }).subscribe()
    }

    removePlaylistVideo(): void {
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
            videoId: this.videoId,
            playlistId: this.playlistId
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