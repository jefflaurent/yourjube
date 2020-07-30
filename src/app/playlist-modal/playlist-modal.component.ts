import { Component, OnInit } from '@angular/core';
import { Playlists } from '../model/playlist';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { PlaylistService } from '../data-service/playlist-data';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.scss']
})
export class PlaylistModalComponent implements OnInit {

  playlists: Playlists[] = []
  status: boolean
  constructor(private state: PlaylistModalInfo, private data: PlaylistService ) { }

  ngOnInit(): void {
    this.data.currentPlaylist.subscribe( playlist => this.playlists = playlist)
    this.state.currentStatus.subscribe( status => this.status = status)
  }

  closeModal(): void {
    this.state.changeStatus(false)
  }

}
