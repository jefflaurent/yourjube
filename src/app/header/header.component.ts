import { Apollo } from'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocialAuthService, SocialUser } from "angularx-social-login";

import { UserService } from '../data-service/user-service';
import { VideoService } from '../data-service/video-service';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { NotificationService } from '../data-service/notification-service';
import { PlaylistVideoService } from '../data-service/playlist-video-service';

import { Bells } from '../model/bell';
import { Playlists } from '../model/playlist'
import { Subscriptions } from '../model/subscription';
import { Notifications } from '../model/notification';

import gql from 'graphql-tag';
import { from } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  loggedIn: boolean
  user: SocialUser
  channel: any = null
  message: string
  query: string
  selectedVideo: any
  playlists: Playlists[] = []
  allSubscriptions: Subscriptions[] = []
  mySubscription: Subscriptions[] = []
  playlistLimit: number
  restrictMode: boolean = null
  uploadModal: boolean
  showMore: boolean
  showLess: boolean

  allNotifications: Notifications[] = []
  myNotifications: Notifications[] = []

  allBells: Bells[] = []
  myBells: Bells[] = []

  constructor(private authService: SocialAuthService, private apollo: Apollo, private data: PlaylistService, private videoData: PlaylistVideoService, private videoService: VideoService, private userService: UserService, private modalInfo: PlaylistModalInfo, private subscriptionService: SubscriptionService, private notificationService: NotificationService) { }
  
  ngOnInit(): void {
    this.query = ""
    this.playlistLimit = 5

    if(localStorage.getItem('users') == null) {
      this.user = null
    }
    else {
      this.getUser();
    }

    if(localStorage.getItem('restrict') == null) {
      localStorage.setItem('restrict', JSON.stringify('false'))
      this.restrictMode = false
    }
    else {
      if(JSON.parse(localStorage.getItem('restrict')) == 'true')
        this.restrictMode = true
      else
        this.restrictMode = false
    }
    
    this.modalInfo.modalStatus.subscribe( status => {
      this.uploadModal = status
    })

    this.userService.getUser(this.user.email).valueChanges.subscribe( result => {
      this.channel = result.data.findChannel[0]

      this.subscriptionService.fetchAllSubs().valueChanges.subscribe( result => {
        this.allSubscriptions = result.data.subscriptions
        this.filterSubs()
      })

      this.notificationService.fetchAllBells().valueChanges.subscribe( result => {
        this.allBells = result.data.bells
        this.filterBells()

        this.notificationService.fetchAllNotifications().valueChanges.subscribe( result => {
          this.allNotifications = result.data.notifications
          this.filterNotifications()
        })
      })
    })

    this.data.fetchAllPlaylist().valueChanges.subscribe( playlist => {
      this.playlists = playlist.data.allPlaylists
      if(this.playlists.length > 3)
        this.showMore = true
        this.showLess = true
    })
    
    var btnOn = document.querySelector('#toggleOn');
    var btnClose = document.querySelector('#toggleClose');
    btnOn.addEventListener('click', this.toggleOn);
    btnClose.addEventListener('click', this.toggleOff);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = (user != null)
      this.addStorage(user)
      this.checkExist();
    });
  }

  filterSubs(): void {
    let j = 0;
    for(let i = 0; i < this.allSubscriptions.length; i++) {
      if(this.allSubscriptions[i].clientEmail == this.channel.email) {
        this.mySubscription[j] = this.allSubscriptions[i]
        j++
      }
    }
  }

  filterBells(): void {
    let j = 0
    for(let i = 0; i < this.allBells.length; i++) {
      if(this.channel.id == this.allBells[i].clientId) {
        this.myBells[j] = this.allBells[i]
        j++
      }
    }
  }

  checkBelled(channelId: number): boolean {
    var temp = this.myBells.find(b => b.channelId == channelId)
    if(!temp)
      return false
    else 
      return true
  }

  filterNotifications(): void {
    let j = 0
    for(let i = 0; i < this.allNotifications.length; i++) {
      if(this.checkBelled(this.allNotifications[i].channelId)) {
        this.myNotifications[j] = this.allNotifications[i]
        j++
      }
    }
  }

  checkExist(): void {
    this.apollo.query<any>({
      query: gql`
        query getOne ($email: String!){
          findChannel(email: $email){
            id,
            name,
            email,
          }
        }
      `, 
      variables: {
        email: this.user.email
      }
    }).subscribe(channel => {
      if(channel.data.findChannel.length != 0) {

      }
      else {
        this.channel = channel;
        this.register();
      }
    })
  }

  register(): void {
    this.apollo.mutate({
      mutation: gql`
        mutation insert($name: String!, $email: String!, $photoURL: String!, $bannerURL: String!, $subscriber: Int!, $isPremium: String!){
          createChannel(input:{ name: $name, email: $email, photoURL: $photoURL,bannerURL: $bannerURL, subscriber: $subscriber, isPremium: $isPremium}) {
            name, 
            email,
            photoURL,
            bannerURL,
            subscriber,
            isPremium
          }
        }
      `,
      variables: {
        name: this.user.name,
        email: this.user.email,
        photoURL: this.user.photoUrl,
        bannerURL: 'http',
        subscriber: 0,
        isPremium: 'false',
      }
    }).subscribe( result => {
      console.log(result)
    })
  }

  signOut() : void {
    this.clearStorage();
    this.authService.signOut();
  }

  addStorage(user) {
    localStorage.setItem('users', JSON.stringify(this.user))
  }

  clearStorage() {
    window.localStorage.clear();
    this.loggedIn = false;
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('users'))
    this.loggedIn = true
  }

  fetchUser() {
    return this.user;
  }

  toggleOn() : void {
    var isActive:any;
    var nav:any;
    isActive = document.querySelector('.active');
    nav = document.querySelector('.nav');
    nav.classList.add('active');
  }

  toggleOff() : void {
    var isActive:any;
    var nav:any;
    isActive = document.querySelector('.active');
    nav = document.querySelector('.nav');
    nav.classList.remove('active');
  }

  toggleModal(): void {
    var x = document.querySelector('.profile-modal')
    x.classList.toggle('hidden')
  }

  toggleMature(): void {
    if(this.restrictMode == true) {
      this.videoService.changeStatus(false)
      localStorage.setItem('restrict', JSON.stringify('false'))
    }
    else {
      this.videoService.changeStatus(true)
      localStorage.setItem('restrict', JSON.stringify('true'))
    }
  }

  toggleUploadModal(): void {
    if(this.uploadModal == true) {
      this.uploadModal = false
      this.modalInfo.changeModal(false)
    }
    else {
      this.uploadModal = true
      this.modalInfo.changeModal(true)
    }
  }

  expandPlaylist(): void { 
    var showMore = document.querySelector('.show-more')
    var showLess = document.querySelector('.show-less')
    showMore.classList.add('hidden')
    showLess.classList.remove('hidden')
    this.playlistLimit = this.playlists.length
  }

  shrinkPlaylist(): void {
    var showMore = document.querySelector('.show-more')
    var showLess = document.querySelector('.show-less')
    showMore.classList.remove('hidden')
    showLess.classList.add('hidden')
    this.playlistLimit = 5
  }

  toggleNotif(): void {
    var notif = document.querySelector('.notification-modal')
    notif.classList.toggle('hidden')
  }
}
