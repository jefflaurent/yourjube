import { UserService } from '../data-service/user-service';
import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  @Input('notif') notification: {
    id: number
    channelId: number
    route: number
    photoURL: string
    content: string
    type: string
    time: number
  }

  post: string 
  posterChannel: Channel

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.processPost()
    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.posterChannel = result.data.channels.find(c => c.id == this.notification.channelId)
    })
  }

  processPost(): void {
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.notification.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 0)
          this.post = 'Today'
        else if(count == 1)
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

  relocate(): void {
    if(this.notification.type == 'video') {
      var query = "http://localhost:4200/video/" + this.notification.route
      location.href = query
    }
    else {
      var query = "http://localhost:4200/channel/" + this.notification.route
      location.href = query
    }
  }
}
