import { Component, OnInit } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { UserService } from '../data-service/user-service';
import { SubscriptionService } from '../data-service/subscription-service';
import { Videos } from '../model/video';
import { Channel } from '../model/channel';
import { Subscriptions } from '../model/subscription';

@Component({
  selector: 'app-subscription-page',
  templateUrl: './subscription-page.component.html',
  styleUrls: ['./subscription-page.component.scss']
})
export class SubscriptionPageComponent implements OnInit {

  constructor(private videoService: VideoService, private subscriptionService: SubscriptionService, private userService: UserService) { }
  
  allVideos: Videos[] = []
  todayVideos: Videos[] =[]
  weekVideos: Videos[] = []
  monthVideos: Videos[] = []
  allSubscriptions: Subscriptions[] = []
  mySubList: Subscriptions[] = []
  user: any
  allChannel: Channel[]
  loggedInChannel: Channel

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'))

    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.allChannel = result.data.channels
      this.loggedInChannel = this.allChannel.find( c => c.email == this.user.email)
    })

    this.subscriptionService.fetchAllSubs().valueChanges.subscribe( result => {
      this.allSubscriptions = result.data.subscriptions
      this.filterSubs()

      this.videoService.fetchAllVideos().valueChanges.subscribe( result => {
        this.allVideos = result.data.videos
        this.filterToday()
        this.filterWeek()
        this.filterMonth()
      })
    })
  }

  filterSubs(): void {
    let j = 0;
    console.log(this.allSubscriptions)
    for(let i = 0; i < this.allSubscriptions.length; i++) {
      if(this.allSubscriptions[i].clientEmail == this.loggedInChannel.email) {
        this.mySubList[j] = this.allSubscriptions[i]
        j++
      }
    }
  }

  isSubbed(creatorEmail: string): boolean {
    var temp: Subscriptions
    console.log(this.mySubList)
    temp = this.mySubList.find( s => s.channelEmail == creatorEmail)
    console.log(temp)
    return temp == undefined ? false : true;
  }

  filterToday(): void {
    let j = 0
    var date = new Date()
    var currTime = date.getTime()
    this.todayVideos = []

    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time < 86400000 && this.isSubbed(this.allVideos[i].channelEmail)) {
        this.todayVideos[j] = this.allVideos[i]
        this.todayVideos.sort( (a,b) => (a.time > b.time) ? -1 : 1)
        j++
      }
    }
  }

  filterWeek(): void {
    let j = 0
    var date = new Date()
    var currTime = date.getTime()
    this.weekVideos = []

    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time >=  86400000 && currTime - this.allVideos[i].time < 604800000 && this.isSubbed(this.allVideos[i].channelEmail)) {
        this.weekVideos[j] = this.allVideos[i]
        this.weekVideos.sort( (a,b) => (a.time > b.time) ? -1 : 1)
        j++
      }
    }
  }

  filterMonth(): void {
    let j = 0
    var date = new Date()
    var currTime = date.getTime()
    this.monthVideos = []

    for(let i = 0; i < this.allVideos.length; i++) {
      if(this.allVideos[i].visibility == 'public' && currTime - this.allVideos[i].time >=  604800000 && currTime - this.allVideos[i].time < 2678400000 && this.isSubbed(this.allVideos[i].channelEmail)) {
        this.monthVideos[j] = this.allVideos[i]
        this.monthVideos.sort( (a,b) => (a.time > b.time) ? -1 : 1)
        j++
      }
    }
  }
}
