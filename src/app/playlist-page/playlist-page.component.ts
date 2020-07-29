import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Videos } from '../videos';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  videos: Videos[] = [];
  playlistName: string = "Playlist #1"
  playlistDescription: string = "No Description"
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.fetchVideos();
  }

  fetchVideos(): void {
    this.apollo.watchQuery<any>({
      query: gql`
      query getVideos {
        videos {
          videoId,
          videoTitle,
          videoDesc,
          videoURL,
          videoThumbnail,
          uploadDay,
          uploadMonth,
          uploadYear,
          views,
          likes,
          dislikes,
          visibility,
          viewer,
          category,
          channelName,
          channelPhotoURL,
          channelEmail,
        }
      }
    `
    }).valueChanges.subscribe( result => {
      console.log(result)
      this.videos = result.data.videos
    })
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
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.add('hidden')
    y.classList.remove('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

}
