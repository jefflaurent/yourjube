import { Component, OnInit } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { Videos } from '../model/video';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
  styleUrls: ['./trending-page.component.scss']
})
export class TrendingPageComponent implements OnInit {

  constructor(private videoService: VideoService) { }
  videos: Videos[] = []
  showVideos: Videos[] = []
  selected: string

  ngOnInit(): void {
    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.videos = result.data.videos
      this.trendingSort()
    })  
  }

  trendingSort(): void {
    this.videos.sort( (a,b) => (a.views > b.views) ? -1 : 1)
    for(let i = 0; i < this.videos.length; i++)
      this.showVideos[i] = this.videos[i]
  } 

  changeToMusic(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'music') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.music')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }

  changeToGaming(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'gaming') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.gaming')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }

  changeToNews(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'news') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.news')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }

  changeToEnt(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'entertainment') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.entertainment')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }

  changeToSport(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'sport') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.sport')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }

  changeToTravel(): void {
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'travel') {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
    // var y = document.querySelector('icon-container')
    // var x = document.querySelector('.travel')
    // y.classList.remove('selected')
    // x.classList.add('selected')
  }
}
