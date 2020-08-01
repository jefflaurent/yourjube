import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { PlaylistVideos } from '../model/playlist-video';
import { Videos } from '../model/video'; 
import gql from 'graphql-tag';

@Injectable()
export class PlaylistVideoService implements OnInit{

    private messageSource = new BehaviorSubject<PlaylistVideos[]>([])
    currentPlaylistVideo = this.messageSource.asObservable()
    playlistVideos: PlaylistVideos[] = []
    user: any
    playlistId: any
    video: Videos
    videoId: any

    constructor(private apollo: Apollo) {}

    ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem('users'))
      this.fetchPlaylistVideos()
    }

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

    fetchPlaylistVideos(): void {
        this.apollo.watchQuery<any>({
            query: this.fetchPlaylistVideoQuery, 
            variables: {
                channelEmail: this.user.email
            }
        }).valueChanges.subscribe( result => {
            console.log(result)
            this.changePlaylist(result.data.playlistVideos)
        })
    }

    initiateAddPlaylistVideo(playlistId: BigInteger, video: Videos): void{
        this.playlistId = playlistId;
        this.video = video;
        console.log(this.playlistId)
        console.log(this.video)
        this.addPlaylistVideo();
    }

    initiateRemovePlaylistVideo(playlistId: BigInteger, videoId: BigInteger): void {
        this.playlistId = playlistId;
        this.videoId = videoId;
        this.removePlaylistVideo();
    }

    addPlaylistVideo(): void {
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
              playlistId: this.playlistId,
              videoId: this.video.videoId,
              videoName: this.video.videoTitle,
              videoThumbnail: this.video.videoThumbnail,
              videoURL: this.video.videoURL,
              channelName: this.video.channelName,
              channelEmail: this.video.channelEmail,
            },
            refetchQueries: [{
                query: this.fetchPlaylistVideoQuery,
                variables: {
                    channelEmail: this.user.email
                }
            }]
        }).subscribe()
    }

    removePlaylistVideo(): void {
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
                    channelEmail: this.user.email
                }
            }]
        }).subscribe()
    }
}