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
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.videos.sort( (a,b) => (a.views > b.views) ? -1 : 1)
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].time >= currSecond){
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  } 

  changeToMusic(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'music' && currSecond <= this.videos[i].time) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }

  changeToGaming(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'gaming' && this.videos[i].time >= currSecond) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }

  changeToNews(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'news' && this.videos[i].time >= currSecond) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }

  changeToEnt(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'entertainment' && this.videos[i].time >= currSecond) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }

  changeToSport(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'sport' && this.videos[i].time >= currSecond) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }

  changeToTravel(): void {
    var date = new Date()
    var currSecond = date.getTime() - 604800000
    this.showVideos = []
    let j = 0
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].category == 'travel' && this.videos[i].time >= currSecond) {
        this.showVideos[j] = this.videos[i]
        j++
      }
    }
  }
}
