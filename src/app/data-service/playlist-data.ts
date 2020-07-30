import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { Playlists } from '../model/playlist';
import gql from 'graphql-tag';

@Injectable()
export class PlaylistService implements OnInit{
    
    user: any
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
            this.changeMessage(playlist.data.playlists)
        })
    }
}