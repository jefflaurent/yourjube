import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { Playlists } from '../model/playlist';
import gql from 'graphql-tag';

@Injectable()
export class PlaylistService implements OnInit{
    
    user: any
    date: any
    playlistName: string
    visibility: string
    private messageSource = new BehaviorSubject<Playlists[]>([]);
    private messageSource2 = new BehaviorSubject<BigInteger>(new Uint8Array);
    currentPlaylist = this.messageSource.asObservable();
    currentVideo = this.messageSource2.asObservable();
    constructor(private apollo: Apollo) {}

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

    changeMessage(newPlaylist: Playlists[]) {
        this.messageSource.next(newPlaylist)
    }

    changeVideo(newVideo: BigInteger) {
        this.messageSource2.next(newVideo)
    }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('users'))
        this.fetchPlaylist()
    }

    fetchPlaylist(): void{
        this.apollo.watchQuery<any>({
            query: this.fetchPlaylistQuery,
            variables: {
                channelEmail: this.user.email
            }
        }).valueChanges.subscribe( playlist => {
            console.log(playlist)
            this.changeMessage(playlist.data.playlists)
        })
    }

    initiateCreatePlaylist(playlistName: string, visibility: string): void {
        this.date = new Date()
        this.playlistName = playlistName
        this.visibility = visibility
        this.createPlaylist();
    }

    createPlaylist(): void {
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
            playlistThumbnail: "",
            playlistDescription: "No Description",
            channelEmail: this.user.email,
            lastDate: this.date.getDate(),
            lastMonth: this.date.getMonth(),
            lastYear: this.date.getFullYear(),
            videoCount: 0,
            views: 0,
            visibility: this.visibility,
          },
            refetchQueries: [{
                query: this.fetchPlaylistQuery,
                variables: {
                    channelEmail: this.user.email
                }
            }],
        }).subscribe()
    }
}