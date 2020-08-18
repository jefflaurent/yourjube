import { Component, OnInit } from '@angular/core';
import { UserService } from '../data-service/user-service';

@Component({
  selector: 'app-channel-page',
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss']
})
export class ChannelPageComponent implements OnInit {

  constructor(private userService: UserService) { }

  user: any
  channel: any

  ngOnInit(): void {
    if(localStorage.getItem('users') != null) {
      this.user = JSON.parse(localStorage.getItem('users'))
    }

    this.userService.getUser(this.user.email).valueChanges.subscribe( result => {
      this.channel = result.data.findChannel[0]
    })
  }

  moveToHome(): void {
    this.hideVideos()
    this.hidePlaylist()
    this.hideAbout()
    this.hideSettings()
    this.showHome()
  }

  moveToVideos(): void {
    this.hideHome()
    this.hidePlaylist()
    this.hideAbout()
    this.hideSettings()
    this.showVideos()
  }

  moveToPlaylist(): void {
    this.hideHome()
    this.hideVideos()
    this.hideAbout()
    this.hideSettings()
    this.showPlaylist()
  }

  moveToAbout(): void {
    this.hideHome()
    this.hideVideos()
    this.hidePlaylist()
    this.hideSettings()
    this.showAbout()
  }

  moveToSettings(): void {
    this.hideHome()
    this.hideVideos()
    this.hidePlaylist()
    this.hideAbout()
    this.showSettings()
  }

  showHome(): void {
    var x = document.querySelector('.channel-home')
    var y = document.querySelector('.home')
    x.classList.remove('hidden')
    y.classList.add('selected')
  }

  hideHome(): void {
    var x = document.querySelector('.channel-home')
    var y = document.querySelector('.home')
    x.classList.add('hidden')
    y.classList.remove('selected')
  }

  showVideos(): void {
    var x = document.querySelector('.channel-videos')
    var y = document.querySelector('.videos')
    x.classList.remove('hidden')
    y.classList.add('selected')
  }

  hideVideos(): void {
    var x = document.querySelector('.channel-videos')
    var y = document.querySelector('.videos')
    x.classList.add('hidden')
    y.classList.remove('selected')
  }

  showPlaylist(): void {
    var x = document.querySelector('.channel-playlist')
    var y = document.querySelector('.playlist')
    x.classList.remove('hidden')
    y.classList.add('selected')
  }

  hidePlaylist(): void {
    var x = document.querySelector('.channel-playlist')
    var y = document.querySelector('.playlist')
    x.classList.add('hidden')
    y.classList.remove('selected')
  }

  showAbout(): void {
    var x = document.querySelector('.channel-about')
    var y = document.querySelector('.about')
    x.classList.remove('hidden')
    y.classList.add('selected')
  }

  hideAbout(): void {
    var x = document.querySelector('.channel-about')
    var y = document.querySelector('.about')
    x.classList.add('hidden')
    y.classList.remove('selected')
  }

  showSettings(): void {
    var x = document.querySelector('.channel-settings')
    var y = document.querySelector('.settings')
    x.classList.remove('hidden')
    y.classList.add('selected')
  }

  hideSettings(): void {
    var x = document.querySelector('.channel-settings')
    var y = document.querySelector('.settings')
    x.classList.add('hidden')
    y.classList.remove('selected')
  }
}
