import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Playlists } from '../model/playlist';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { Videos } from '../model/video';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class PlaylistService{
    
    user: any
    date: any
    newId: any
    playlistTemp: Playlists[]
    playlistName: string
    allPlaylists: Playlists[] = []
    visibility: string
    private messageSource = new BehaviorSubject<Playlists[]>([]);
    private messageSource2 = new BehaviorSubject<BigInteger>(new Uint8Array);
    currentPlaylist = this.messageSource.asObservable();
    currentVideo = this.messageSource2.asObservable();

    constructor(private apollo: Apollo, private playlistVideoService: PlaylistVideoService) {}

    fetchPlaylistQuery = gql`
        query getPlaylist($channelEmail: String!){
            playlists(channelEmail: $channelEmail){
                playlistId,
                playlistName,
                playlistThumbnail,
                playlistDescription,
                channelEmail,
                lastDate,
                lastMonth,
                lastYear,
                videoCount,
                views,
                visibility
            }
        }
    `;

    fetchAllPlaylistQuery = gql`
      query allPlaylists{
        allPlaylists{
            playlistId,
            playlistName,
            playlistThumbnail,
            playlistDescription,
            channelEmail,
            lastDate,
            lastMonth,
            lastYear,
            videoCount,
            views,
            visibility
        }
      }
    `;

    changeMessage(newPlaylist: Playlists[]) {
        this.messageSource.next(newPlaylist)
    }

    changeVideo(newVideo: BigInteger) {
        this.messageSource2.next(newVideo)
    }

    fetchPlaylist(email: String): any{
      return this.apollo.watchQuery<any>({
          query: this.fetchPlaylistQuery,
          variables: {
              channelEmail: email
          }
      })
    }

    fetchAllPlaylist(): any {
      return this.apollo.watchQuery<any>({
        query: this.fetchAllPlaylistQuery,
      })
    }

    initiateCreatePlaylist(playlistName: string, visibility: string, video: Videos): void {
        var x = JSON.parse(localStorage.getItem('users'))
        this.date = new Date()
        this.playlistName = playlistName
        this.visibility = visibility
        this.createPlaylist(x.email, video);
    }

    createPlaylist(email: string, video: Videos): void {
        this.apollo.mutate({
          mutation: gql`
            mutation createPlaylist(
              $playlistName: String!,
              $playlistThumbnail: String!,
              $playlistDescription: String!,
              $channelEmail: String!,
              $lastDate: Int!,
              $lastMonth: Int!,
              $lastYear: Int!,
              $videoCount: Int!,
              $views: Int!,
              $visibility: String!,
            ) {
              createPlaylist(input: {
                playlistName: $playlistName,
                playlistThumbnail: $playlistThumbnail,
                playlistDescription: $playlistDescription,
                channelEmail: $channelEmail,
                lastDate: $lastDate,
                lastMonth: $lastMonth,
                lastYear: $lastYear,
                videoCount: $videoCount,
                views: $views,
                visibility: $visibility,
              }) {
                playlistId,
                playlistName,
                playlistThumbnail,
                playlistDescription,
                channelEmail,
                lastDate,
                lastMonth,
                lastYear,
                videoCount,
                views,
                visibility,
              }
            }
          `,
          variables: {
            playlistName: this.playlistName,
            playlistThumbnail: video[0].videoThumbnail,
            playlistDescription: "No Description",
            channelEmail: email,
            lastDate: this.date.getDate(),
            lastMonth: this.date.getMonth(),
            lastYear: this.date.getFullYear(),
            videoCount: 1,
            views: 0,
            visibility: this.visibility,
          },
            refetchQueries: [{
                query: this.fetchAllPlaylistQuery
            }],
        }).subscribe( result => {
          var date
          date = new Date()
          this.playlistVideoService.addPlaylistVideo(((result as any).data.createPlaylist.playlistId), video[0], date.getTime(), 1)
        })
    }

    changePlaylistName(id: string, name: string): void {
      this.lastUpdated(id)
      this.apollo.mutate({
        mutation: gql`
          mutation changeName($playlistId: ID!, $playlistName: String!) {
              changePlaylistName(playlistId: $playlistId, playlistName: $playlistName)
          }
        `,
        variables: {
          playlistId: id,
          playlistName: name,
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    changePlaylistDesc(id: string, desc: string): void {
      this.lastUpdated(id)
      this.apollo.mutate({
        mutation: gql`
          mutation changeDesc($playlistId: ID!, $playlistDescription: String!) {
              changePlaylistDesc(playlistId: $playlistId, playlistDescription: $playlistDescription)
          }
        `,
        variables: {
          playlistId: id,
          playlistDescription: desc,
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    changePlaylistVisibility(id: string, visibility: string): void {
      this.lastUpdated(id)
      this.apollo.mutate({
        mutation: gql`
          mutation changeVisibility($playlistId: ID!, $visibility: String!) {
              changePlaylistVisibility(playlistId: $playlistId, visibility: $visibility)
          }
        `,
        variables: {
          playlistId: id,
          visibility: visibility,
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    lastUpdated(playlistId: string): void {
      var date = new Date()
      this.apollo.mutate({
        mutation: gql`
          mutation update($playlistId: ID!, $lastDate: Int!, $lastMonth: Int!, $lastYear: Int!) {
            updatePlaylistUpdate(playlistId: $playlistId, lastDate: $lastDate, lastMonth: $lastMonth, lastYear: $lastYear)
          }
        `,
        variables: {
          playlistId: playlistId,
          lastDate: date.getDate(),
          lastMonth: date.getMonth(),
          lastYear: date.getFullYear(),
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    addVideoCount(id: any): void{ 
      this.apollo.mutate({
        mutation: gql`
          mutation addVideoCount($playlistId: ID!) {
            addVideoCount(playlistId: $playlistId)
          }
        `,
        variables: {
          playlistId: id
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    decreaseVideoCount(playlistId: any): void{ 
      this.apollo.mutate({
        mutation: gql`
          mutation decreaseVideoCount($playlistId: ID!) {
            decreaseVideoCount(playlistId: $playlistId)
          }
        `,
        variables: {
          playlistId: playlistId
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }

    updateThumbnail(playlistId: any, playlistThumbnail: string) {
      var x = JSON.parse(localStorage.getItem('users'))
      this.apollo.mutate({
        mutation: gql`
          mutation updateThumbnail($playlistId: Int!, $playlistThumbnail: String!) {
            updateThumbnail(playlistId: $playlistId, playlistThumbnail: $playlistThumbnail)
          }
        `,
        variables: {
          playlistId: playlistId,
          playlistThumbnail: playlistThumbnail
        },
        refetchQueries: [{
          query: this.fetchAllPlaylistQuery,
        }]
      }).subscribe()
    }
}