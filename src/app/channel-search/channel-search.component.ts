import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionService } from '../data-service/subscription-service';
import { NotificationService } from '../data-service/notification-service';
import { UserService } from '../data-service/user-service';
import { Subscriptions } from '../model/subscription';
import { Bells } from '../model/bell';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-channel-search',
  templateUrl: './channel-search.component.html',
  styleUrls: ['./channel-search.component.scss']
})
export class ChannelSearchComponent implements OnInit {

  @Input('chan') channel :{
    id: number
    name: string
    email: string
    photoURL: string
    bannerURL: string
    subscriber: number
    isPremium: string
    joinDate: number
    joinMonth: number
    joinYear: number
    channelDescription: string
    isMature: string
    twitter: string
    facebook: string
    instagram: string
    validPremium: number
  }

  isBelled: boolean
  isSubscribed: boolean
  allBells: Bells[] = []
  allSubscriptions: Subscriptions[] = []
  mySubscription: Subscriptions = null
  loggedInChannel: Channel
  allChannels: Channel[] = []
  user: any

  constructor(private subscriptionService: SubscriptionService, private userService: UserService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'))
    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.allChannels = result.data.channels
      this.loggedInChannel = this.allChannels.find( c => c.email == this.user.email)

      this.subscriptionService.fetchAllSubs().valueChanges.subscribe( result => {
        this.allSubscriptions = result.data.subscriptions
        console.log(this.allSubscriptions)
        this.mySubscription = this.allSubscriptions.find( s => s.clientEmail == this.loggedInChannel.email && s.channelEmail == this.channel.email)
        if(this.mySubscription == null)
          this.isSubscribed = false
        else
          this.isSubscribed = true
      })

      this.notificationService.fetchAllBells().valueChanges.subscribe( result => {
        this.allBells = result.data.bells
        var belled = this.allBells.find( b => b.clientId == this.loggedInChannel.id && b.channelId == this.channel.id)
        if(belled == undefined)
          this.isBelled = false
        else
          this.isBelled = true
      })
    })
  }

  addSub(): void {
    this.subscriptionService.registerSubs(this.loggedInChannel.email, this.channel)
    this.userService.increaseSubscriber(this.channel.id)
  }

  removeSub(): void {
    this.subscriptionService.removeSubs(this.loggedInChannel.email, this.channel.email)
    this.userService.decreaseSubscriber(this.channel.id)
  }

  addBell(): void {
    this.notificationService.addBell(this.loggedInChannel.id, this.channel.id)
  }

  removeBell(): void {
    this.notificationService.deleteBell(this.loggedInChannel.id, this.channel.id)
  }
}
