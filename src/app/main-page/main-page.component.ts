import { Component, OnInit } from '@angular/core';
import { Apollo } from'apollo-angular';
import { Videos } from '../model/video';
import gql from 'graphql-tag'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  videos: Videos[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.fetchVideos();
  }

  fetchVideos(): void {
    this.apollo.query<any>({
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
    }).subscribe(result => {
      this.videos = result.data.videos
    })
  }
}
