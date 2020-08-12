import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { VideoService } from '../data-service/video-service';
import { UserService } from '../data-service/user-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  videos: Videos[] = [];
  tempVideos: Videos[] = []
  videoCount: number
  observer: any
  restrictMode: boolean

  constructor(private apollo: Apollo, private videoService: VideoService, private userService: UserService) { }

  ngOnInit(): void {
    this.videoCount = 12

    this.videos = []
    this.tempVideos = []
    
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

    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.videos = result.data.videos
      this.tempVideos = result.data.videos

      if(this.restrictMode)
        this.filterMature()

      this.shuffle(this.videos)
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

  filterMature(): void {
    let j = 0;
    this.videos = []
    for(let i = 0; i < this.tempVideos.length; i++) {
      if(this.tempVideos[i].visibility == 'public' && this.tempVideos[i].viewer == 'kids') {
        this.videos[j] = this.tempVideos[i]
        j++
      }
    }
  }

  shuffle(array): void {
    var currentIndex = array.length
    var temporaryValue
    var randomIndex;
  
    while (currentIndex !== 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }
}
