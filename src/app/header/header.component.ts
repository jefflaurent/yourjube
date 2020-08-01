import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from 'angularx-social-login';
import { Apollo } from'apollo-angular';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { Playlists } from '../model/playlist'
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
  selectedVideo: any
  playlists: Playlists[] = []

  constructor(private authService: SocialAuthService, private apollo: Apollo, private data: PlaylistService, private videoData: PlaylistVideoService) { }
  
  ngOnInit(): void {
    this.videoData.ngOnInit();
    this.data.ngOnInit();
    this.data.currentPlaylist.subscribe( playlist => this.playlists = playlist)
    var btnOn = document.querySelector('#toggleOn');
    var btnClose = document.querySelector('#toggleClose');
    btnOn.addEventListener('click', this.toggleOn);
    btnClose.addEventListener('click', this.toggleOff);

    if(localStorage.getItem('users') == null) {
      this.user = null
    }
    else {
      this.getUser();
    }
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
    }).subscribe()
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
}
