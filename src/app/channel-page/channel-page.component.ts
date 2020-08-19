import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { Channel } from '../model/channel'; 
import { Subscriptions } from '../model/subscription';

@Component({
  selector: 'app-channel-page',
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss']
})
export class ChannelPageComponent implements OnInit {

  constructor(private subscriptionService: SubscriptionService, private userService: UserService, private activatedRoute: ActivatedRoute) { }

  user: any
  channelId: any
  channel: Channel
  loggedInChannel: Channel
  allChannels: Channel [] = []
  isSubscribed: boolean
  allSubscriptions: Subscriptions[] = []

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      this.channelId = params.get('id')

      if(localStorage.getItem('users') != null) {
        this.user = JSON.parse(localStorage.getItem('users'))
      }

      this.userService.getAllChannel().valueChanges.subscribe( result => {
        this.allChannels = result.data.channels
        this.channel = this.allChannels.find( c => c.id == this.channelId)
        this.loggedInChannel = this.allChannels.find( c => c.email == this.user.email)

        this.subscriptionService.fetchAllSubs().valueChanges.subscribe( result => {
          this.allSubscriptions = result.data.subscriptions
          var temp = this.allSubscriptions.find( s => s.channelEmail == this.channel.email && s.clientEmail == this.loggedInChannel.email)
          if(temp)
            this.isSubscribed = true
          else
            this.isSubscribed = false
        })
      })
    })
  }

  addSub(): void {
    this.subscriptionService.registerSubs(this.loggedInChannel.email, this.channel)
    this.userService.increaseSubscriber(this.channel.id)
  }

  removeSub(): void {
    this.subscriptionService.removeSubs(this.loggedInChannel.email, this.channel.email)
    this.userService.decreaseSubscriber(this.channel.id)
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
