import { Component, OnInit, Input } from '@angular/core';
import { Playlists } from '../model/playlist';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.scss']
})
export class VideoPageComponent implements OnInit {
  @Input('vid') video: {
    videoId: BigInteger,        
    videoTitle: string,  
    videoDesc: string,
    videoURL: string,
    videoThumbnail: string,
    uploadDay: string,
    uploadMonth: string,
    uploadYear: string,
    views: BigInteger,
    likes: BigInteger,     
    dislikes: BigInteger,      
    visibility: string,    
    viewer: string,       
    category: string,      
    channelName: string,
    channelPhotoURL: string,
    channelEmail: string,
  }

  getPlaylistQuery = gql`
    query getPlaylist($channelEmail: String!) {
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
        visibility,
      }
    }
  `;

  constructor(private apollo: Apollo, private data: PlaylistService, private status: PlaylistModalInfo, private playlistData: PlaylistVideoService) { }

  playlists: Playlists[] = [];
  dummyId: string = ''
  dummyId2: string = ""
  time: Date
  date: any
  month: any
  year: any
  user: any

  post : string

  ngOnInit(): void {
    this.dummyId = 'vid' + this.video.videoId
    this.dummyId2 = 'play' + this.video.videoId
    this.time = new Date()
    this.date = this.time.getDate()
    this.month = this.time.getMonth()
    this.year = this.time.getFullYear()

    this.user = JSON.parse(localStorage.getItem('users'))

    if(parseInt(this.video.uploadYear) < this.year) {
      let gap = this.year - parseInt(this.video.uploadYear) 
      if(gap == 1) 
        this.post = gap + ' year ago';
      else
        this.post = gap + ' years ago';
    }
    else if(parseInt(this.video.uploadYear) == this.year && parseInt(this.video.uploadMonth) < this.month) {
      let gap = this.month - parseInt(this.video.uploadMonth)
      if(gap == 1)
        this.post = gap + ' month ago';
      else 
        this.post = gap + ' months ago';
    }
    else if(parseInt(this.video.uploadYear) == this.year && parseInt(this.video.uploadMonth) == this.month && parseInt(this.video.uploadDay) <= this.date) {
      let gap = this.date - parseInt(this.video.uploadDay)
      if(gap >= 7)
      {
        if(gap >= 7 && gap < 14)
          this.post = '1 week ago'
        else if(gap >= 14 && gap < 21)
          this.post = '2 weeks ago'
        else if(gap >= 21 && gap < 28)
          this.post = '3 weeks ago'
        else if(gap >= 28)
          this.post = '4 weeks ago'
      }
      else 
      {
        if(gap == 0)
          this.post = 'Today';
        else if(gap == 1)
          this.post = gap + ' day ago';
        else
          this.post = gap + ' days ago';
      }
    }
  }

  toggleModal(): void {
    var query = '#' + this.dummyId
    var x = document.querySelector(query)
    x.classList.toggle('hidden')
  }

  showPlaylist(): void {
    this.toggleModal()
    this.data.changeVideo(this.video.videoId)
    this.status.changeStatus(true)
  }
}
