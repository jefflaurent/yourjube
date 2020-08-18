import { Component, OnInit, Input } from '@angular/core';
import { Videos } from '../model/video';
import { VideoService } from '../data-service/video-service'; 
import { UserService } from '../data-service/user-service';

@Component({
  selector: 'app-channel-videos',
  templateUrl: './channel-videos.component.html',
  styleUrls: ['./channel-videos.component.scss']
})
export class ChannelVideosComponent implements OnInit {

  @Input('chan') channel: {
    id: number
    name: string
    email: string
    photoURL: string
    bannerURL: string
    subscriber: number
    isPremium: string
  }

  constructor(private videoService: VideoService, private userService: UserService) { }

  allVideos: Videos[] = []
  videos: Videos[] = []
  videoCount: number
  observer: any

  ngOnInit(): void {
    this.videoCount = 12;
    this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
      this.allVideos = result.data.videos
      this.filterVideos()
    })
  }

  setObserver(): void {
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

  filterVideos(): void {
    let j = 0
    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].channelEmail == this.channel.email) {
        this.videos[j] = this.allVideos[i];
        j++;
        this.videos.sort((a,b) => (a.time < b.time) ? -1 : 1)
      }
    }
    this.setObserver()
  }

  toggleModal(): void {
    var x = document.querySelector('.modal')
    x.classList.toggle('hidden')
  }

  sortByViews(): void {
    this.videos.sort( (a,b) => (a.views > b.views) ? -1 : 1)
    this.toggleModal()
  }

  sortByDateDesc(): void {
    this.videos.sort( (a,b) => (a.time > b.time) ? -1 : 1)
    this.toggleModal()
  }

  sortByDateAsc(): void {
    this.videos.sort( (a,b) => (a.time < b.time) ? -1 : 1)
    this.toggleModal()
  }
}
