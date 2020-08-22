import { Component, OnInit } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { ActivatedRoute } from '@angular/router';
import { Videos } from '../model/video';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

  constructor(private videoService: VideoService, private activatedRoute: ActivatedRoute) { }

  allVideos: Videos[] = []
  recentVideos: Videos[] = []
  weekVideos: Videos[] = []
  monthVideos: Videos[] = []
  allTimeVideos: Videos[] = []
  category: string
  categoryTitle: string

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      this.allVideos = []
      this.recentVideos = []
      this.weekVideos = []
      this.monthVideos = []
      this.allTimeVideos = []

      this.category = params.get('category')
      if(this.category == 'gaming')
        this.categoryTitle = 'Gaming'
      else if(this.category == 'news')
        this.categoryTitle = 'News'
      else if(this.category == 'music')
        this.categoryTitle = 'Music'
      else if(this.category == 'entertainment')
        this.categoryTitle = 'Entertainment'
      else if(this.category == 'sport')
        this.categoryTitle = 'Sport'
      else if(this.category == 'travel')
        this.categoryTitle = 'Travel'

      this.videoService.fetchAllVideos().valueChanges.subscribe(result => {
        this.allVideos = result.data.videos
        this.filterAllTime()
        this.filterThisWeek()
        this.filterThisMonth()
        this.filterRecently()
      })
    })
  }

  toggleModal(): void {
    var btn = document.querySelector('.sort-modal')
    console.log(btn)
    btn.classList.toggle('hidden')
  }

  filterAllTime(): void {
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].category == this.category && this.allVideos[i].visibility == 'public') {
        this.allTimeVideos[j] = this.allVideos[i]
        this.allTimeVideos.sort((a,b) => (a.views > b.views) ? -1 : 1)
        j++ 
      }
    }
  }

  filterThisWeek(): void {
    var date = new Date()
    var currTime = date.getTime()
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].category == this.category && this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time <= 604800000) {
        this.weekVideos[j] = this.allVideos[i]
        this.weekVideos.sort((a,b) => (a.views > b.views) ? -1 : 1)
        j++ 
      }
    }
  }

  filterThisMonth(): void {
    var date = new Date()
    var currTime = date.getTime()
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].category == this.category && this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time <= 2678400000) {
        this.monthVideos[j] = this.allVideos[i]
        this.monthVideos.sort((a,b) => (a.views > b.views) ? -1 : 1)
        j++ 
      }
    }
  }

  filterRecently(): void {
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].category == this.category && this.allVideos[i].visibility == 'public') {
        this.recentVideos[j] = this.allVideos[i]
        this.recentVideos.sort((a,b) => (a.time > b.time) ? -1 : 1)
        j++ 
      }
    }
  }
}
