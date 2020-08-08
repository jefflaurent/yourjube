import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  videos: Videos[] = [];
  videoCount: number
  observer: any

  constructor(private apollo: Apollo, private videoService: VideoService) { }

  ngOnInit(): void {
    this.videoCount = 12
    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.videos = result.data.videos
    })

    this.observer = new IntersectionObserver( (entry) => {
      if(entry[0].isIntersecting) {
        setTimeout( ()=> {
          var container = document.querySelector('.video-container')
          for(let i = 0; i < 4; i++) {
            if(this.videoCount < this.videos.length) {
              var div = document.createElement('div')
              var video = document.createElement('app-video-page')
              video.setAttribute('vid', 'this.videos[this.videoCount]')
              div.appendChild(video)
              container.appendChild(div)
              this.videoCount++
            }
          }
        }, 1500)
      }
    })

    this.observer.observe(document.querySelector('.footer'))
  }
}
