import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { NotificationService } from '../data-service/notification-service';
import { PostService } from '../data-service/post-service';
import { UserService } from '../data-service/user-service';
import { Channel } from '../model/channel';
import { finalize } from 'rxjs/operators';
import { Posts } from '../model/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channel-community',
  templateUrl: './channel-community.component.html',
  styleUrls: ['./channel-community.component.scss']
})
export class ChannelCommunityComponent implements OnInit {

  @Input('chan') channel: {
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

  task: AngularFireUploadTask
  percentage: Observable<number>
  snapshot: Observable<any>
  url: Observable<string>
  content: string

  allPosts: Posts[] = []
  channelPosts: Posts[] = []
  owner: boolean

  user: any
  loggedInChannel: Channel

  constructor(private storage: AngularFireStorage, private postService: PostService, private notificationService: NotificationService, private userService: UserService) { }

  ngOnInit(): void {

    if(localStorage.getItem('users') != null)
      this.user = JSON.parse(localStorage.getItem('users')) 

    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.loggedInChannel = result.data.channels.find( c => c.email == this.user.email)
    })
      
    this.postService.fetchAllPost().valueChanges.subscribe( result => {
      this.allPosts = result.data.posts
      this.filterPost()
    })
    this.content = ""
  }

  filterPost(): void {
    let j = 0
    for(let i = 0; i < this.allPosts.length; i++) {
      if(this.allPosts[i].channelId == this.channel.id) {
        this.channelPosts[j] = this.allPosts[i]
        j++
      }
    }
  }

  togglePost(): void {
    var x = document.querySelector('.new-post-container')
    var y = document.querySelector('.add-post-btn')
    x.classList.toggle('hidden')
    y.classList.toggle('hidden')
  }

  uploadImage(event: FileList) {
    const file = event.item(0)

    const path = `post/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.url = url;
        });
      })
    ).subscribe();
  }

  createPost(): void {
    var photoURL = ""

    if(this.url != null)
      photoURL = this.url.toString()

    this.postService.createPost(this.channel.id, this.content, photoURL)
    var notifContent = this.channel.name + " posted: " + this.content
    this.addNotification(photoURL, notifContent)

    this.togglePost()
    this.url = null
    this.content = ""
  }

  addNotification(photoURL: string, content: string): void {
    this.notificationService.addNotification(this.loggedInChannel.id, this.loggedInChannel.id, photoURL, content, "community")
  }
}
