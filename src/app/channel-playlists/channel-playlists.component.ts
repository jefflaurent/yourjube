import { Component, OnInit, Input } from '@angular/core';
import { Playlists } from '../model/playlist';
import { PlaylistService } from '../data-service/playlist-data';

@Component({
  selector: 'app-channel-playlists',
  templateUrl: './channel-playlists.component.html',
  styleUrls: ['./channel-playlists.component.scss']
})
export class ChannelPlaylistsComponent implements OnInit {

  @Input('chan') channel: {
    id: number
    name: string
    email: string
    photoURL: string
    bannerURL: string
    subscriber: number
    isPremium: string
  }

  constructor(private playlistService: PlaylistService) { }

  allPlaylist: Playlists[] = []
  playlists: Playlists[] = []

  ngOnInit(): void {
    this.playlistService.fetchAllPlaylist().valueChanges.subscribe( result => {
      this.allPlaylist = result.data.allPlaylists
      this.filterPlaylist()
    })
  }

  filterPlaylist(): void {
    let j = 0
    for(let i = 0; i < this.allPlaylist.length; i++) {
      if(this.allPlaylist[i].channelEmail == this.channel.email && this.allPlaylist[i].visibility == 'public') {
        this.playlists[j] = this.allPlaylist[i]
        j++
      }
    }
  }
}
