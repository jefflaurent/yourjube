import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { PostService } from '../data-service/post-service';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss']
})
export class CommunityPostComponent implements OnInit {

  @Input('post') post: {
    id: number
    channelId: number
    content: string
    photoURL: string
    likes: number
    dislikes: number
    time: number
  }

  constructor(private userService: UserService, private postService: PostService) { }

  allChannels: Channel[] = []
  loggedInChannel: Channel
  creatorChannel: Channel

  user: any
  timePost: any
  liked: boolean
  disliked: boolean

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('users'))

    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.allChannels = result.data.channels
      this.loggedInChannel = this.allChannels.find(c => c.email == this.user.email)
      this.creatorChannel = this.allChannels.find(c => c.id == this.post.channelId)
      this.processPost()

      this.postService.fetchAllPostLikes().valueChanges.subscribe( result => {
        var temp = result.data.postLikes.find(p => p.postId == this.post.id && p.channelId == this.loggedInChannel.id)
        if(!temp)
          this.liked = false
        else
          this.liked = true
      })
  
      this.postService.fetchAllPostDislikes().valueChanges.subscribe( result => {
        var temp = result.data.postDislikes.find(p => p.postId == this.post.id && p.channelId == this.loggedInChannel.id)
        if(!temp)
          this.disliked = false
        else
          this.disliked = true
      })
    })
  }

  initiateLike(): void {
    if(this.liked) {
      this.unlikePost()
    }
    else {
      if(this.disliked) {
        this.undislikePost()
      }
      this.likePost()
    }
  }

  initiateDislike(): void {
    if(this.disliked) {
      this.undislikePost()
    }
    else {
      if(this.liked) {
        this.unlikePost()
      }
      this.dislikePost()
    }
  }

  likePost(): void {
    this.postService.likePost(this.post.id, this.loggedInChannel.id)
    this.liked = true
  }

  unlikePost(): void {
    this.postService.unlikePost(this.post.id, this.loggedInChannel.id)
    this.liked = false
  }

  dislikePost(): void {
    this.postService.dislikePost(this.post.id, this.loggedInChannel.id)
    this.disliked = true
  }

  undislikePost(): void {
    this.postService.undislikePost(this.post.id, this.loggedInChannel.id)
    this.disliked = false
  }

  processPost(): void {
    var date = new Date()
    var currSecond = date.getTime()
    var count = 0
    let gap = currSecond - this.post.time

    if(gap < 2678400000) {
      if(gap < 604800000) {
        count = gap / 86400000
        count = Math.floor(count)
        if(count == 0)
          this.timePost = 'Today'
        else if(count == 1)
          this.timePost = count + ' day ago'
        else
          this.timePost = count + ' days ago'
      }
      else if(gap >= 604800000) {
        if(gap >= 604800000 && gap < 1209600000)
          this.timePost = '1 week ago'
        else if(gap >= 1209600000 && gap < 1814400000)
          this.timePost = '2 weeks ago'
        else if(gap >= 1814400000 && gap < 2419200000)
          this.timePost = '3 weeks ago'
        else if(gap >= 2419200000)
          this.timePost = '4 weeks ago'
      }
    }
    else if(gap < 30758400000) {
      count = gap / 2678400000
      count = Math.floor(count)

      if(count == 1)
        this.timePost = count + ' month ago'
      else
        this.timePost = count + ' months ago'
    }
    else {
      count = gap / 30758400000
      count = Math.floor(count)
      
      if(gap == 1) 
        this.timePost = gap + ' year ago';
      else
        this.timePost = gap + ' years ago';
    }
  }
}
