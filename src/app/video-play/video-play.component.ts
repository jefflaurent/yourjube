import { Apollo } from 'apollo-angular';
import { Videos } from '../model/video';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VideoService } from '../data-service/video-service';
import { CommentService } from '../data-service/comment-service';
import { UserService } from '../data-service/user-service';
import { Comments } from '../model/comment';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.scss']
})
export class VideoPlayComponent implements OnInit {

  getCommentQuery = gql`
  query getComments($videoId: Int!){
      comments(videoId: $videoId) {
        commentId,
        videoId,
        channelId,
        channelName,
        channelEmail,
        channelPhotoURL,
        content,
        replyTo,
        likes,
        dislikes,
        day,
        month,
        year,
        replies
      }
    }
  `;

  firstVideo: Videos[] = [];
  videos: Videos[] = [];
  passVideos: Videos[] = [];
  showComments: Comments[] = [];
  comments: Comments[] = [];
  currVid: Videos
  id: any
  month: any
  post: string
  channel: any = null
  isLimited: boolean = true
  isLiked: boolean
  isDisliked: boolean
  user: any
  content: string = ""
  declare: any
  videoLimit: number
  commentLimit: number
  observer: any

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private videoService: VideoService, private commentService: CommentService, private userService: UserService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(params => {
      this.commentLimit = 3
      this.videoLimit = 4
      this.id = params.get('id');
      this.user = JSON.parse(localStorage.getItem('users'))
      this.videoService.watchVideo(this.id)

      this.setObserver()

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
        this.convertDate();
        this.fetchUser();
        this.sortVideos();
        this.processVideos();
      })

      this.commentService.fetchComments(this.id).valueChanges.subscribe( result => {
        this.comments = []
        this.comments = result.data.comments
        this.processComments()
      })
    })
  }

  setObserver(): void {
    this.observer = new IntersectionObserver( (entry) => {
      if(entry[0].isIntersecting) {
        setTimeout( ()=> {
          this.fetchNewSide()
          this.fetchNewComments()
        }, 1500)
      }
    })

    this.observer.observe(document.querySelector('.footer'))
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
    var field = document.querySelector('.desc-bot')
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')

    btnShrink.classList.remove('hidden')
    btnExpand.classList.add('hidden')
    field.classList.remove('limited')
    this.isLimited = false
  }

  shrinkField() : void {
    var field = document.querySelector('.desc-bot')
    var btnShrink = document.querySelector('#shrinkBtn')
    var btnExpand = document.querySelector('#expandBtn')

    btnShrink.classList.add('hidden')
    btnExpand.classList.remove('hidden')

    field.classList.add('limited')
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
    this.commentService.addComment(this.id, this.channel.data.findChannel[0], this.content, 0)
    this.content = " "
  }

  like(): void {
    this.videoService.addLike(this.channel.data.findChannel[0], this.currVid)
    this.videoService.increaseLike(this.currVid.videoId)
    this.isLiked = true
    this.paintBlue('.like')
  }

  unlike(): void {
    this.videoService.removeLike(this.channel.data.findChannel[0], this.id)
    this.videoService.decreaseLike(this.id)
    this.isLiked = false
    this.paintGrey('.like')
  }

  dislike(): void {
    this.videoService.addDislike(this.channel.data.findChannel[0], this.currVid)
    this.videoService.increaseDislike(this.id)
    this.isDisliked = true
    this.paintBlue('.dislike')
  }

  undislike(): void {
    this.videoService.removeDislike(this.channel.data.findChannel[0], this.id)
    this.videoService.decreaseDislike(this.id)
    this.isDisliked = false
    this.paintGrey('.dislike')
  }

  fetchUser(): void {
    this.apollo.query<any>({
      query: gql`
        query getUser($email: String!) {
          findChannel(email: $email) {
            id,
            name,
            email,
            photoURL,
            bannerURL,
            subscriber,
            isPremium
          }
        }
      `,
      variables: {
        email: this.currVid.channelEmail
      },
    }).subscribe( channel => {
        this.channel = channel;
    })
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
      if(this.videos[i].videoId > this.id && this.videos[i].category == this.currVid.category) {
        this.passVideos[j] = this.videos[i];
        j++;
      }
    }

    for(let i = 0; i < this.videos.length; i++) {
      if(this.videos[i].videoId < this.id && this.videos[i].category == this.currVid.category) {
        this.passVideos[j] = this.videos[i];
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
}
