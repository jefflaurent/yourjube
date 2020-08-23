import { Component, OnInit, Input } from '@angular/core';
import { Playlists } from '../model/playlist';
import { UserService } from '../data-service/user-service';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { Channel } from '../model/channel';

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
    views: number,
    likes: number,     
    dislikes: number,      
    visibility: string,    
    viewer: string,       
    category: string,      
    channelName: string,
    channelPhotoURL: string,
    channelEmail: string,
    time: number,
  }

  constructor(private data: PlaylistService, private status: PlaylistModalInfo, private playlistData: PlaylistVideoService, private userService: UserService) { }

  playlists: Playlists[] = [];
  dummyId: string = ''
  dummyId2: string = ""
  channelId: any
  date: any
  month: any
  year: any
  user: any
  views: any
  post : string
  creator: Channel

  ngOnInit(): void {
    this.dummyId = 'vid' + this.video.videoId
    this.dummyId2 = 'play' + this.video.videoId

    this.user = JSON.parse(localStorage.getItem('users'))
    this.processViews()

    this.userService.getUser(this.video.channelEmail).valueChanges.subscribe( result => {
      this.creator = result.data.findChannel[0]
    })
    
    this.processPost()
  }

  processPost(): void {
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.video.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 1)
          this.post = count + ' day ago'
        else
          this.post = count + ' days ago'
      }
      else if(gap >= 604800000) {
        if(gap >= 604800000 && gap < 1209600000)
          this.post = '1 week ago'
        else if(gap >= 1209600000 && gap < 1814400000)
          this.post = '2 weeks ago'
        else if(gap >= 1814400000 && gap < 2419200000)
          this.post = '3 weeks ago'
        else if(gap >= 2419200000)
          this.post = '4 weeks ago'
      }
    }
    else if(gap < 30758400000) {
      count = gap / 2678400000
      count = Math.floor(count)

      if(count == 1)
        this.post = count + ' month ago'
      else
        this.post = count + ' months ago'
    }
    else {
      count = gap / 30758400000
      count = Math.floor(count)
      
      if(gap == 1) 
        this.post = gap + ' year ago';
      else
        this.post = gap + ' years ago';
    }
  }

  processViews(): void {
    if(this.video.views >= 1000 && this.video.views < 10000) {
      var front = Math.floor(this.video.views / 1000) 
      var rest = this.video.views - front
      var back = Math.floor(rest / 100)
      this.views = front + '.' + back + 'K'
    }
    else if(this.video.views >= 10000 && this.video.views <= 100000) {
      this.views = Math.floor(this.video.views / 1000) + 'K'
    }
    else if(this.video.views >= 1000000) {
      var front = Math.floor(this.video.views / 1000000)
      var rest = this.video.views - front
      var back = Math.floor(rest / 100000)
      this.views = front + '.' + back + 'M' 
    }
    else {
      this.views = this.video.views + ''
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
