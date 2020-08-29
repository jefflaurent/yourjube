import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatVideoComponent } from 'mat-video/lib/video.component';

import { VideoService } from '../data-service/video-service';
import { CommentService } from '../data-service/comment-service';
import { UserService } from '../data-service/user-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { NotificationService } from '../data-service/notification-service';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service';

import { PlaylistVideos } from '../model/playlist-video';
import { Subscriptions } from '../model/subscription';
import { Playlists } from '../model/playlist';
import { Comments } from '../model/comment';
import { Channel } from '../model/channel';
import { Videos } from '../model/video';
import { Bells } from '../model/bell';

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.scss']
})
export class VideoPlayComponent implements OnInit {

  video: HTMLVideoElement
  firstVideo: Videos[] = []
  videos: Videos[] = []
  passVideos: Videos[] = []
  queueVideos: Videos[] = []
  currVid: Videos

  showComments: Comments[] = [];
  comments: Comments[] = [];
  
  allChannels: Channel[] = []
  loggedInChannel: Channel
  channel: Channel
  
  subscriptions: Subscriptions[] = []
  mySubscription: Subscriptions

  currentPlaylist: Playlists
  currentPlaylistVideos: PlaylistVideos[] = []

  allBells: Bells[]
  isBelled: boolean 

  id: any
  month: any
  post: string

  isSubscribed: boolean
  isLimited: boolean = true
  isLiked: boolean
  isDisliked: boolean
  
  fromPlaylist: boolean
  fromQueue: boolean
  playlistId: number
  playlistIdTemp: string

  user: any
  content: string = ""
  declare: any
  videoLimit: number
  commentLimit: number
  videoObserver: any
  commentObserver: any
  description: any
  autoPlay: boolean

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private videoService: VideoService, private commentService: CommentService, private userService: UserService, private subscriptionService: SubscriptionService, private notificationService: NotificationService, private playlistService: PlaylistService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.autoPlay = true
      this.commentLimit = 3
      this.id = params.get('id');
      this.playlistIdTemp = params.get('playlistid')
      this.user = JSON.parse(localStorage.getItem('users'))
      this.videoService.watchVideo(this.id)

      this.fromPlaylist = this.playlistIdTemp ? true : false
      this.videoLimit = 4

      if(this.fromPlaylist) {
        this.fromQueue = false
        this.playlistId = parseInt(this.playlistIdTemp)
        this.playlistService.fetchAllPlaylist().valueChanges.subscribe( result => {
          this.currentPlaylist = result.data.allPlaylists.find(p => p.playlistId == this.playlistId)
        })

        this.playlistVideoService.fetchPlaylistVideosById(this.playlistId).valueChanges.subscribe( result => {
          this.currentPlaylistVideos = result.data.playlistVideosById
        })
      }
      else {
        this.checkQueue()
      }

      this.setObserver()
      this.setVideoObserver()

      this.videoService.checkLiked(this.id, this.user.email).valueChanges.subscribe( result => {
        if(result.data.findLike.length > 0) {
            this.isLiked = true
            setTimeout( ()=> {
              this.paintBlue('.like')
            }, 2000)
        }
        else {
            this.isLiked = false
            setTimeout( ()=> {
              this.paintGrey('.like')
            }, 2000)
        }
      })

      this.videoService.checkDisliked(this.id, this.user.email).valueChanges.subscribe( result => {
        if(result.data.findDislike.length > 0) {
          this.isDisliked = true
          this.paintBlue('.dislike')
        }
        else if(result.data.findDislike.length == 0) {
          this.isDisliked = false
          this.paintGrey('.dislike')
        }
      })
      
      this.videoService.fetchAllVideos().valueChanges.subscribe( result =>  {
        this.videos = result.data.videos
        this.currVid = this.videos.find( v => v.videoId == this.id)

        if(this.fromQueue) {
          this.getQueueVideos()
        }

        setTimeout( () => {
          this.userService.getAllChannel().valueChanges.subscribe(result => {
            this.allChannels = result.data.channels
            this.channel = this.allChannels.find( c => c.email = this.currVid.channelEmail)
            this.loggedInChannel = this.allChannels.find( c => c.email = this.user.email)

            this.notificationService.fetchAllBells().valueChanges.subscribe( result => {
              this.allBells = result.data.bells
              var temp = this.allBells.find(b => b.clientId == this.loggedInChannel.id && b.channelId == this.channel.id)
              if(temp == undefined)
                this.isBelled = false
              else
                this.isBelled = true
            })
          })
        }, 500)

        setTimeout( ()=> {
          this.subscriptionService.fetchAllSubs().valueChanges.subscribe( sub => {
            this.subscriptions = sub.data.subscriptions
            this.mySubscription = this.subscriptions.find( s => s.channelEmail == this.currVid.channelEmail && s.clientEmail == this.loggedInChannel.email)
            if(this.mySubscription == null)
              this.isSubscribed = false
            else
              this.isSubscribed = true
          })

          this.video = (document.getElementsByTagName('mat-video')[0] as HTMLVideoElement).querySelector('video')
          this.setVideoListener()
          this.setVideoHotkeys()
          
          this.shortenDesc()
          this.convertDate()
          this.sortVideos()
          this.processVideos()
        }, 500)
      })

      this.commentService.fetchComments(this.id).valueChanges.subscribe( result => {
        this.comments = []
        this.comments = result.data.comments
        this.processComments()
      })
    })
  }

  checkQueue(): void {
    if(localStorage.getItem('queue') != null) {
      var arr = JSON.parse(localStorage.getItem('queue'))
      if(arr[0] == this.id) {
        if(arr.length == 1) 
          this.fromQueue = false
        else
          this.fromQueue = true
        
        arr.shift()
        localStorage.setItem('queue', JSON.stringify(arr))
      }
      else {
        this.fromQueue = true
      }
    } 
    else {
      this.fromQueue = false
    }
  }

  getQueueVideos(): void {
    var arr = JSON.parse(localStorage.getItem('queue'))
    console.log('queuenya ini ')
    console.log(arr)
    for(let i = 0; i < arr.length; i++) {
      this.queueVideos[i] = this.videos.find(v => v.videoId == arr[i])
    }
  }

  findIndex(): number {
    for(let i = 0; i < this.currentPlaylistVideos.length; i++) {
      if(this.currentPlaylistVideos[i].videoId == this.currVid.videoId) 
        return i + 1
    }
  }

  findQueueIndex(): number {
    var arr = JSON.parse(localStorage.getItem('queue'))
    console.log('finding ' + this.id + ' on ')
    console.log(arr)
    for(let i = 0; i < arr.length; i++) {
      if(this.id == arr[i]) {
        return i;
      }
    } 
  }

  setVideoListener(): void {
    this.video.addEventListener('ended', () => {
      if(this.fromPlaylist) {
        if(this.autoPlay) {
          var idx = this.findIndex()
          if(idx >= this.currentPlaylistVideos.length)
            location.href = "http://localhost:4200/video/" + this.passVideos[0].videoId
          else
            location.href = "http://localhost:4200/video/playlist/" + this.currentPlaylist.playlistId + '/' + this.currentPlaylistVideos[idx].videoId
        }
      }
      else if(this.fromQueue) {
        if(this.autoPlay) {
          var arr = JSON.parse(localStorage.getItem('queue'))
          var idx = this.findQueueIndex()
          if(idx == undefined) {
            location.href = "http://localhost:4200/video/" + this.queueVideos[0].videoId
          }
          else if(idx == arr.length) {
            arr.splice(idx,1)
            location.href = "http://localhost:4200/video/" + this.passVideos[0].videoId
          }
          else {
            arr.splice(idx,1)
            location.href = "http://localhost:4200/video/" + this.queueVideos[idx].videoId
          }
        }
      }
      else {
        if(this.autoPlay)
          location.href = "http://localhost:4200/video/" + this.firstVideo[0].videoId
      }
    })
  }

  setVideoHotkeys(): void {
    var audio_element = this.video;
    document.onkeydown = function(event) {
      switch (event.keyCode) {
        case 38:
            event.preventDefault();
            var audio_vol = (audio_element).volume;
            if (audio_vol != 1) {
              try {
                  var x = audio_vol + 0.02;
                  audio_element.volume = x;
                  var a = (((audio_element.closest("mat-video").querySelector("mat-volume-control")
                  .querySelector("mat-slider").querySelector(".mat-slider-thumb-container"))) as HTMLElement);
                  var min = (1-x)*100;
                  var c = "translate(-" + min +"%)";
                  a.style.transform = c;

                  a.querySelector(".mat-slider-thumb-label-text").innerHTML = x.toString();
                }
              catch(err) {
                  audio_element.volume = 1;
              }
            }
            break;
        case 40:
            event.preventDefault();
            audio_vol = audio_element.volume;
            if (audio_vol != 0) {
              try {
                var x = audio_vol - 0.02;
                audio_element.volume = x;
                var a = (((audio_element.closest("mat-video").querySelector("mat-volume-control")
                .querySelector("mat-slider").querySelector(".mat-slider-thumb-container"))) as HTMLElement);
                var min = (1 - x) * 100;
                var c = "translate(-" + min +"%)";
                a.style.transform = c;

                a.querySelector(".mat-slider-thumb-label-text").innerHTML = x.toString();
              }
              catch(err) {
                  audio_element.volume = 0;
              }
              
            }
            break;
          case 74:
            event.preventDefault();
            audio_element.currentTime -= 10;
            break;
          case 75:
            event.preventDefault();
            audio_element.paused == false ? audio_element.pause() : audio_element.play();
            break;
          case 76:
            event.preventDefault();
            audio_element.currentTime += 10;
            break;
      }
    }
  }

  removeVideoListener(): void {
    this.video.removeEventListener('ended', () => {})
  }

  loadNext(): void {
    console.log(this.video.ended)
  }

  shortenDesc(): void {
    this.description = ""
    if(this.currVid.videoDesc.length > 90) {
      for(let i = 0; i < 90; i ++) {
        this.description += this.currVid.videoDesc.charAt(i)
      }
    }
  }

  returnDesc(): void {
    this.description = ""
    this.description = this.currVid.videoDesc
  }

  setVideoObserver(): void {
    this.videoObserver = new IntersectionObserver( (entry) => {
      if(entry[0].isIntersecting) {
        setTimeout( ()=> {
          this.fetchNewSide()
        }, 1500)
      }
    })

    this.videoObserver.observe(document.querySelector('.side-container-footer'))
  }

  setObserver(): void {
    this.commentObserver = new IntersectionObserver( (entry) => {
      if(entry[0].isIntersecting) {
        setTimeout( ()=> {
          this.fetchNewComments()
        }, 1500)
      }
    })
    this.commentObserver.observe(document.querySelector('.footer'))
  }

  fetchNewSide(): void {
    var container = document.querySelector('.side-container')
    for(let i = 0; i < 5; i++) {
      if(this.videoLimit < this.passVideos.length) {
        var video = document.createElement('app-video-side')
        video.setAttribute('vid', 'this.passVideos[this.videoLimit]')
        container.appendChild(video)
        this.videoLimit++
      }
    }
  }

  fetchNewComments(): void {
    var container = document.querySelector('.comment-container')
    for(let i = 0; i < 3; i++) {
      if(this.commentLimit < this.showComments.length) {
        var comment = document.createElement('app-comment')
        comment.setAttribute('com', 'this.showComments[this.commentLimit]')
        container.appendChild(comment)
        this.commentLimit++
      }
    }
  }

  expandField() : void {
    this.returnDesc()
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')

    btnShrink.classList.remove('hidden')
    btnExpand.classList.add('hidden')
    this.isLimited = false
  }

  shrinkField() : void {
    this.shortenDesc()
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')
    
    btnShrink.classList.add('hidden')
    btnExpand.classList.remove('hidden')
    this.isLimited = true
  }

  showSortModal(): void {
    var btn = document.querySelector('.sort-container')
    btn.classList.toggle('hidden')
  }

  paintBlue(whichClass): void {
    var container = document.querySelector(whichClass)
    container.classList.add('clicked')
  }

  paintGrey(whichClass): void {
    var container = document.querySelector(whichClass)
    container.classList.remove('clicked')
  }

  toggleAutoPlay(): void {
      this.autoPlay = !this.autoPlay
      if(this.autoPlay)
        this.setVideoListener()
      else 
        this.removeVideoListener()
  }

  initiateLike(): void {
    if(this.isLiked == false) {
      this.like()
      if(this.isDisliked == true)
        this.undislike()
    } else if(this.isLiked == true){
      this.unlike()
    }
  }

  initiateDislike(): void {
    if(this.isDisliked == false) {
      this.dislike()
      if(this.isLiked == true)
        this.unlike()
    } else if(this.isDisliked == true){
      this.undislike();
    }
  }

  addComment(): void {
    this.commentService.addComment(this.id, this.loggedInChannel, this.content, 0)
    this.content = " "
  }

  like(): void {
    this.videoService.addLike(this.loggedInChannel, this.currVid)
    this.videoService.increaseLike(this.currVid.videoId)
    this.isLiked = true
    this.paintBlue('.like')
  }

  unlike(): void {
    this.videoService.removeLike(this.loggedInChannel, this.id)
    this.videoService.decreaseLike(this.id)
    this.isLiked = false
    this.paintGrey('.like')
  }

  dislike(): void {
    this.videoService.addDislike(this.loggedInChannel, this.currVid)
    this.videoService.increaseDislike(this.id)
    this.isDisliked = true
    this.paintBlue('.dislike')
  }

  undislike(): void {
    this.videoService.removeDislike(this.loggedInChannel, this.id)
    this.videoService.decreaseDislike(this.id)
    this.isDisliked = false
    this.paintGrey('.dislike')
  }

  addSub(): void {
    this.subscriptionService.registerSubs(this.loggedInChannel.email, this.channel)
    console.log(this.channel.id)
    this.userService.increaseSubscriber(this.channel.id)
  }

  removeSub(): void {
    this.subscriptionService.removeSubs(this.loggedInChannel.email, this.channel.email)
    console.log(this.channel.id)
    this.userService.decreaseSubscriber(this.channel.id)
  }

  convertDate(): void {
    if(parseInt(this.currVid.uploadMonth) == 1)
      this.month = 'Jan'
    else if(parseInt(this.currVid.uploadMonth) == 2)
      this.month = 'Feb'
    else if(parseInt(this.currVid.uploadMonth) == 3)
      this.month = 'Mar'
    else if(parseInt(this.currVid.uploadMonth) == 4)
      this.month = 'Apr'
    else if(parseInt(this.currVid.uploadMonth) == 5)
      this.month = 'May'
    else if(parseInt(this.currVid.uploadMonth) == 6)
      this.month = 'Jun'
    else if(parseInt(this.currVid.uploadMonth) == 7)
      this.month = 'Jul'
    else if(parseInt(this.currVid.uploadMonth) == 8)
      this.month = 'Aug'
    else if(parseInt(this.currVid.uploadMonth) == 9)
      this.month = 'Sep'
    else if(parseInt(this.currVid.uploadMonth) == 10)
      this.month = 'Oct'
    else if(parseInt(this.currVid.uploadMonth) == 11)
      this.month = 'Nov'
    else if(parseInt(this.currVid.uploadMonth) == 12)
      this.month = 'Dec'
    
    this.post = this.month + ' ' + this.currVid.uploadDay + ', ' + this.currVid.uploadYear
  }

  sortVideos(): void {
    this.videos.sort(function(a,b) {return a.videoId - b.videoId})
  }

  processVideos(): void {
    var j = 0;
    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId > this.id) {
        this.passVideos[j] = this.videos[i]
        j++;
      }
    }

    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId < this.id && this.videos[i].category == this.currVid.category) {
        this.passVideos[j] = this.videos[i]
        j++;
      }
    }

    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId != this.currVid.videoId && this.videos[i].category != this.currVid.category) {
        this.passVideos[j] = this.videos[i]
        j++;
      }
    }
    
    this.firstVideo[0] = this.passVideos[0]
    this.passVideos.shift()
  }

  processComments(): void {
    this.showComments = []
    let j = 0
    for(let i = 0; i < this.comments.length; i++) {
      if(this.comments[i].replyTo == 0) {
        this.showComments[j] = this.comments[i]
        j++
      }
    }
  }

  sortByLikes(): void {
    this.showComments.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
  }

  sortByNewest(): void {
    this.showComments.sort((a,b) => (a.time > b.time) ? -1 : 1)
  }

  addBell(): void {
    this.notificationService.addBell(this.loggedInChannel.id, this.channel.id)
  }

  removeBell(): void {
    this.notificationService.deleteBell(this.loggedInChannel.id, this.channel.id)
  }
}
