import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Playlists } from '../model/playlist';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistVideos } from '../model/playlist-video';
import { PlaylistService } from '../data-service/playlist-data';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  channel: any
  playlistCreator: any
  playlistTemp: any

  playlistVideosTemp: PlaylistVideos[] = []
  playlistVideos: PlaylistVideos[] = []

  currPlaylist: Playlists
  playlists: Playlists[] = []

  visibility: string 
  playlistName: string
  playlistDescription: string
  post: string
  
  playlistId: any
  d: any
  m: any
  y: any

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private data: PlaylistVideoService, private currData: PlaylistService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.playlistId = params.get('id');
      this.channel = JSON.parse(localStorage.getItem('users'))

      this.data.fetchPlaylistVideos(this.channel.email).valueChanges.subscribe( playlistVideo => {
        this.playlistTemp = playlistVideo
        this.playlistVideosTemp = this.playlistTemp.data.playlistVideos
        this.filterVideos();
      })
  
      this.currData.fetchPlaylist(this.channel.email).valueChanges.subscribe( playlist => {
        this.playlists = playlist.data.playlists
        this.currPlaylist = this.playlists.find( p => p.playlistId == this.playlistId)
        this.playlistName = this.currPlaylist.playlistName
        this.playlistDescription = this.currPlaylist.playlistDescription
        this.visibility = this.currPlaylist.visibility
        if(this.visibility == 'public')
          this.visibility = "Public"
        else
          this.visibility = "Private"
        this.processDate()
        this.fetchCreator()
      })
    })
  }

  filterVideos(): void {
    let j = 0;
    for(let i = 0; i < this.playlistVideosTemp.length; i++){
      if(this.playlistVideosTemp[i].playlistId == this.playlistId) {
        this.playlistVideos[j] = this.playlistVideosTemp[i];
        j++;
      }
    }
  }

  hidePencil(): void {
    var x = document.querySelector('.editTitle')
    var y = document.querySelector('.title')
    var z = document.querySelector('.titleTxt')
    var a = document.querySelector('.title-btn')

    x.classList.add('none')
    y.classList.remove('hidden')
    z.classList.add('hidden')
    a.classList.remove('hidden')
  }

  returnTitle() {
    this.playlistName = this.currPlaylist.playlistName
    var x = document.querySelector('.editTitle')
    var y = document.querySelector('.title')
    var z = document.querySelector('.titleTxt')
    var a = document.querySelector('.title-btn') 

    x.classList.remove('none')
    y.classList.add('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

  hideDescPencil(): void {
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.remove('hidden')
    y.classList.add('hidden')
    z.classList.add('hidden')
    a.classList.remove('hidden')
  }

  returnDesc(): void {
    this.playlistDescription =  this.currPlaylist.playlistDescription
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.add('hidden')
    y.classList.remove('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

  changePlaylistName(): void {
    this.currData.changePlaylistName(this.playlistId, this.playlistName)
  }

  changePlaylistDesc(): void {
    this.currData.changePlaylistDesc(this.playlistId, this.playlistDescription)
  }

  changePlaylistVisibility(): void {
    var change
    if(this.visibility == 'Public')
      change = 'private'
    else
      change = 'public'
    this.currData.changePlaylistVisibility(this.playlistId, change)
  }

  processDate(): void {
    var date = new Date()
    if(this.currPlaylist.lastDate == date.getDate() &&
      this.currPlaylist.lastMonth == date.getMonth() &&
      this.currPlaylist.lastYear == date.getFullYear()) {
        this.post = 'Updated today'
    }
    else {
      if(this.currPlaylist.lastMonth == 1)
        this.m = 'Jan'
      else if(this.currPlaylist.lastMonth== 2)
        this.m = 'Feb'
      else if(this.currPlaylist.lastMonth == 3)
        this.m = 'Mar'
      else if(this.currPlaylist.lastMonth == 4)
        this.m = 'Apr'
      else if(this.currPlaylist.lastMonth == 5)
        this.m = 'May'
      else if(this.currPlaylist.lastMonth == 6)
        this.m = 'Jun'
      else if(this.currPlaylist.lastMonth == 7)
        this.m = 'Jul'
      else if(this.currPlaylist.lastMonth == 8)
        this.m = 'Aug'
      else if(this.currPlaylist.lastMonth == 9)
        this.m = 'Sep'
      else if(this.currPlaylist.lastMonth == 10)
        this.m = 'Oct'
      else if(this.currPlaylist.lastMonth == 11)
        this.m = 'Nov'
      else if(this.currPlaylist.lastMonth == 12)
        this.m = 'Dec'
      this.post = 'Last updated on ' + this.m + ' ' + this.currPlaylist.lastDate + ', ' + this.currPlaylist.lastYear
    }
  }

  fetchCreator(): void {
    this.apollo.watchQuery<any>({
      query: gql`
        query fetchCreator($email: String!) {
          findChannel(email: $email) {
            id,
            name,
            email,
            photoURL,
            bannerURL,
            subscriber,
            isPremium,
          }
        }
      `,
      variables: {
        email: this.currPlaylist.channelEmail
      }
    }).valueChanges.subscribe( result => {
       this.playlistCreator = result.data.findChannel[0]
    })
  }
}
