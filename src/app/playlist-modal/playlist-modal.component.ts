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

  playlistName: string = ''
  visibility: string
  playlists: Playlists[] = []
  status: boolean
  date: any
  channel: any
  constructor(private state: PlaylistModalInfo, private data: PlaylistService) { }

  ngOnInit(): void {
    this.data.currentPlaylist.subscribe( playlist => this.playlists = playlist)
    this.state.currentStatus.subscribe( status => this.status = status)
    this.channel = JSON.parse(localStorage.getItem('users'))
    this.date = new Date()
  }

  closeModal(): void {
    this.state.changeStatus(false)
  }

  createPlaylist(): void {
    var x = (<HTMLSelectElement>document.getElementById('visibilityOption'))
    this.visibility = x.options[x.selectedIndex].value;
    this.data.initiateCreatePlaylist(this.playlistName, this.visibility)
  }

  openCreate(): void {
    var x = document.querySelector('.common-container')
    x.classList.remove('hidden')
  }
}
