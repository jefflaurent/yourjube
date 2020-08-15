import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from 'angularx-social-login';
import { Apollo } from'apollo-angular';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { VideoService } from '../data-service/video-service';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { UserService } from '../data-service/user-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { Playlists } from '../model/playlist'
import { Subscriptions } from '../model/subscription';
import gql from 'graphql-tag';

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

  constructor(private authService: SocialAuthService, private apollo: Apollo, private data: PlaylistService, private videoData: PlaylistVideoService, private videoService: VideoService, private userService: UserService, private modalInfo: PlaylistModalInfo, private subscriptionService: SubscriptionService) { }
  
  ngOnInit(): void {
    this.query = ""
    this.playlistLimit = 3

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
    this.playlistLimit = 3
  }
}
