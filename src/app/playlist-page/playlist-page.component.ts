import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { PlaylistVideoService } from '../data-service/playlist-video-service';
import { PlaylistService } from '../data-service/playlist-data';
import { VideoService } from '../data-service/video-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { NotificationService } from '../data-service/notification-service';
import { UserService } from '../data-service/user-service';
import { PlaylistVideos } from '../model/playlist-video';
import { Subscriptions } from '../model/subscription';
import { Playlists } from '../model/playlist';
import { Videos } from '../model/video';
import { Channel } from '../model/channel';
import { Bells } from '../model/bell';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  channel: any
  shuffle: any

  allVideos: Videos [] = []
  videoTemp: Videos [] = []

  playlistVideos: PlaylistVideos[] = []
  playlistVideosTemp: PlaylistVideos[] = []
  playlistVideosPushTemp: PlaylistVideos[] = []

  currPlaylist: Playlists
  playlists: Playlists[] = []

  allSubscriptions: Subscriptions[] = []
  mySubscription: Subscriptions

  allChannel: Channel[]
  playlistCreator: Channel
  loggedInAccount: Channel

  allBells: Bells[]
  isBelled: boolean
  
  visibility: string 
  playlistName: string
  playlistDescription: string
  playlistThumbnail: string
  post: string
  playlistId: any
  m: any
  observer: any
  videoLimit: number
  isSubscribed: boolean
  flag: boolean
  

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private data: PlaylistVideoService, private currData: PlaylistService, private videoService: VideoService, private userService: UserService, private subscriptionService: SubscriptionService, private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.flag = false
      this.videoLimit = 7
      this.playlistVideos = []
      this.playlistId = params.get('id');
      this.channel = JSON.parse(localStorage.getItem('users'))
      
      this.data.fetchPlaylistVideos(this.channel.email).valueChanges.subscribe( playlistVideo => {
        this.playlistVideosTemp = playlistVideo.data.playlistVideos
        this.filterVideos();
      })

      this.videoService.fetchAllVideos().valueChanges.subscribe( allVideos => {
        this.allVideos = allVideos.data.videos

        this.currData.fetchAllPlaylist().valueChanges.subscribe( playlist => {
          this.playlists = playlist.data.allPlaylists
          this.currPlaylist = this.playlists.find( p => p.playlistId == this.playlistId)
          this.playlistName = this.currPlaylist.playlistName
          this.playlistDescription = this.currPlaylist.playlistDescription
          this.visibility = this.currPlaylist.visibility
          this.playlistThumbnail = this.currPlaylist.playlistThumbnail
          if(this.visibility == 'public')
            this.visibility = "Public"
          else
            this.visibility = "Private"

          this.userService.getAllChannel().valueChanges.subscribe( result => {
            this.allChannel = result.data.channels
            this.loggedInAccount = this.allChannel.find( c => c.email == this.channel.email)
            this.playlistCreator = this.allChannel.find( c => c.email == this.currPlaylist.channelEmail)
          
            this.subscriptionService.fetchAllSubs().valueChanges.subscribe( result => {
              this.allSubscriptions = result.data.subscriptions
              this.mySubscription = this.allSubscriptions.find( s => s.clientEmail == this.loggedInAccount.email && s.channelEmail == this.playlistCreator.email)
              if(this.mySubscription == undefined)
                this.isSubscribed = false
              else
                this.isSubscribed = true
            })

            this.notificationService.fetchAllBells().valueChanges.subscribe( result => {
              this.allBells = result.data.bells
              var belled = this.allBells.find( b => b.clientId == this.loggedInAccount.id && b.channelId == this.playlistCreator.id)
              if(belled == undefined)
                this.isBelled = false
              else
                this.isBelled = true
            })
          })
          this.processDate()
          this.processVideo()
          this.setObserver()
        })
      })
    })
  }

  setObserver(): void {
    this.observer = new IntersectionObserver( (entry) => {
      if(entry[0].isIntersecting) {
        setTimeout( ()=> {
          var container = document.querySelector('.side-container')
          for(let i = 0; i < 4; i++) {
            if(this.videoLimit < this.playlistVideos.length) {
              var video = document.createElement('app-playlist-side')
              video.setAttribute('play', 'this.playlistVideos[this.videoLimit]')
              container.appendChild(video)
              this.videoLimit++
            }
          }
        }, 1500)
      }
    })
    this.observer.observe(document.querySelector('.footer'))
  }

  addSub(): void {
    this.subscriptionService.registerSubs(this.loggedInAccount.email, this.playlistCreator)
    this.userService.increaseSubscriber(this.channel.id)
  }

  removeSub(): void {
    this.subscriptionService.removeSubs(this.loggedInAccount.email, this.playlistCreator.email)
    this.userService.decreaseSubscriber(this.channel.id)
  }

  filterVideos(): void {
    this.playlistVideos = []
    let j = 0;
    for(let i = 0; i < this.playlistVideosTemp.length; i++){
      if(this.playlistVideosTemp[i].playlistId == this.playlistId) {
        this.playlistVideos[j] = this.playlistVideosTemp[i];
        this.playlistVideos.sort((a,b) => (a.place < b.place) ? -1 : 1)
        j++;
      }
    }
    this.flag = true
    this.shufflePlay()
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
    this.playlistName = this.currPlaylist.playlistName
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
    this.playlistDescription =  this.currPlaylist.playlistDescription
    var x = document.querySelector('.desc')
    var y = document.querySelector('.descTxt')
    var z = document.querySelector('.editDesc')
    var a = document.querySelector('.cancelBtn')

    x.classList.add('hidden')
    y.classList.remove('hidden')
    z.classList.remove('hidden')
    a.classList.add('hidden')
  }

  showModal(): void {
    var x = document.querySelector('.modal')
    x.classList.toggle('hidden') 
  }

  changePlaylistName(): void {
    this.currData.changePlaylistName(this.playlistId, this.playlistName)
  }

  changePlaylistDesc(): void {
    this.currData.changePlaylistDesc(this.playlistId, this.playlistDescription)
  }

  changePlaylistVisibility(): void {
    var change
    if(this.visibility == 'Public')
      change = 'private'
    else
      change = 'public'
    this.currData.changePlaylistVisibility(this.playlistId, change)
  }

  processDate(): void {
    var date = new Date()
    if(this.currPlaylist.lastDate == date.getDate() &&
      this.currPlaylist.lastMonth == date.getMonth() &&
      this.currPlaylist.lastYear == date.getFullYear()) {
        this.post = 'Updated today'
    }
    else {
      if(this.currPlaylist.lastMonth == 1)
        this.m = 'Jan'
      else if(this.currPlaylist.lastMonth== 2)
        this.m = 'Feb'
      else if(this.currPlaylist.lastMonth == 3)
        this.m = 'Mar'
      else if(this.currPlaylist.lastMonth == 4)
        this.m = 'Apr'
      else if(this.currPlaylist.lastMonth == 5)
        this.m = 'May'
      else if(this.currPlaylist.lastMonth == 6)
        this.m = 'Jun'
      else if(this.currPlaylist.lastMonth == 7)
        this.m = 'Jul'
      else if(this.currPlaylist.lastMonth == 8)
        this.m = 'Aug'
      else if(this.currPlaylist.lastMonth == 9)
        this.m = 'Sep'
      else if(this.currPlaylist.lastMonth == 10)
        this.m = 'Oct'
      else if(this.currPlaylist.lastMonth == 11)
        this.m = 'Nov'
      else if(this.currPlaylist.lastMonth == 12)
        this.m = 'Dec'
      this.post = 'Last updated on ' + this.m + ' ' + this.currPlaylist.lastDate + ', ' + this.currPlaylist.lastYear
    }
  }

  processVideo(): void {
    this.videoTemp = []
    for(let i = 0; i < this.playlistVideos.length; i++) {
      this.videoTemp[i] = this.allVideos.find( v => v.videoId == this.playlistVideos[i].videoId)
    }
  }

  sortVideoViewsDesc(): void {
    this.sortVideoByViews();
    this.currData.updateThumbnail(this.playlistId, this.videoTemp[0].videoThumbnail)
    for(let i = 0; i < this.videoTemp.length; i++) {
      this.data.updatePlace(this.playlistId, this.videoTemp[i].videoId, i+1)
    }
  }

  sortUpload():  void {
    this.sortVideoUpload();
    this.currData.updateThumbnail(this.playlistId, this.videoTemp[0].videoThumbnail)
    for(let i = 0; i < this.videoTemp.length; i++) {
      this.data.updatePlace(this.playlistId, this.videoTemp[i].videoId, i+1)
    }
  }

  sortUploadDesc(): void {
    this.sortVideoUploadDesc()
    this.currData.updateThumbnail(this.playlistId, this.videoTemp[0].videoThumbnail)
    for(let i = 0; i < this.videoTemp.length; i++) {
      this.data.updatePlace(this.playlistId, this.videoTemp[i].videoId, i+1)
    }
  }

  sortVideoDate(): void {
    this.sortVideoByDateAdded();
    this.currData.updateThumbnail(this.playlistId, this.playlistVideos[0].videoThumbnail)
    for(let i = 0; i < this.playlistVideos.length; i++) {
      this.data.updatePlace(this.playlistId, this.playlistVideos[i].videoId, i+1)
    }
  }

  sortVideoDateDesc(): void {
    this.sortVideoByDateAdded();
    this.currData.updateThumbnail(this.playlistId, this.playlistVideos[this.playlistVideos.length-1].videoThumbnail)
    let j = 1
    for(let i = this.playlistVideos.length-1; i >= 0; i--) {
      this.data.updatePlace(this.playlistId, this.playlistVideos[i].videoId, j)
      j++
    }
  }
  
  sortVideoUpload(): void {
    this.videoTemp.sort((a,b)=> (a.time < b.time) ? -1 : 1)
  }

  sortVideoUploadDesc(): void {
    this.videoTemp.sort((a,b)=> (a.time > b.time) ? -1 : 1)
  }

  sortVideoByViews(): void {
    this.videoTemp.sort((a,b) => (a.views > b.views) ? -1 : 1)
  }

  sortVideoByDateAdded(): void {
    this.playlistVideos.sort((a,b) => (a.time < b.time) ? -1 : 1)
  }

  sortVideoByUploadDate(): void {
    this.videoTemp.sort((a,b) => (a.time > b.time) ? -1 : 1)
  }

  shufflePlay(): void {
    this.shuffle = Math.random() * (this.playlistVideos.length - 0) + 0
    this.shuffle = Math.floor(this.shuffle)
  }

  addBell(): void {
    this.notificationService.addBell(this.loggedInAccount.id, this.playlistCreator.id)
  }

  removeBell(): void {
    this.notificationService.deleteBell(this.loggedInAccount.id, this.playlistCreator.id)
  }
}
