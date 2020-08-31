import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { PlaylistModalInfo } from '../data-service/playlist-modal-service';
import { NotificationService } from '../data-service/notification-service';
import { UserService } from '../data-service/user-service';
import { PlaylistService } from '../data-service/playlist-data';
import { PlaylistVideoService } from '../data-service/playlist-video-service'; 
import { PlaylistVideos } from '../model/playlist-video';
import { Playlists } from '../model/playlist';
import { Channel } from '../model/channel';
import { Videos } from '../model/video';
import { finalize } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styleUrls: ['./upload-menu.component.scss']
})
export class UploadMenuComponent implements OnInit {
 
  task: AngularFireUploadTask;
  imgTask: AngularFireUploadTask;

  percentage: Observable<number>;
  imgPercentage: Observable<number>;

  snapshot: Observable<any>;
  imgSnapshot: Observable<any>;

  downloadURL: Observable<string>;
  imgDownloadURL: Observable<string>;

  isHovering: boolean;
  titleBox: string = "";
  descriptionBox: string = "";
  audience: string = "";
  visibility: string = "";
  category: string 
  playlistId: number
  time: Date
  day: any
  month: any
  year: any

  private: any
  unlisted: any
  public: any

  yes: any
  no: any
  user: any
  modalStatus: any

  allPlaylists: Playlists[] = []
  myPlaylists: Playlists[] = []
  playlistVideos: PlaylistVideos[] = []
  loggedInChannel: Channel
  toPlaylist: boolean

  constructor(private storage: AngularFireStorage, private apollo: Apollo, private modalInfo: PlaylistModalInfo, private userService: UserService, private notificationService: NotificationService, private playlistService: PlaylistService, private playlistVideoService: PlaylistVideoService) { }

  ngOnInit(){
    if(localStorage.getItem('users') != null)
      this.user = JSON.parse(localStorage.getItem('users'))
    
    this.userService.getAllChannel().valueChanges.subscribe( result => {
      this.loggedInChannel = result.data.channels.find(c => c.email == this.user.email)

      this.playlistService.fetchAllPlaylist().valueChanges.subscribe( result => {
        this.allPlaylists = result.data.allPlaylists
        this.filterPlaylists()
      })
    })

    this.modalInfo.modalStatus.subscribe( status => {
      this.modalStatus = status
      if(this.modalStatus == true) {
        var btn = document.querySelector('.upload-container')
        btn.classList.remove('hidden')
      }
      else {
        var btn = document.querySelector('.upload-container')
        btn.classList.add('hidden')
      }
    })
  }

  filterPlaylists(): void {
    var j = 0
    for(let i = 0; i < this.allPlaylists.length; i++) { 
      if(this.allPlaylists[i].channelEmail == this.loggedInChannel.email) {
        this.myPlaylists[j] = this.allPlaylists[i]
        j++
      }
    }
    this.populateSelect()
  }
  
  populateSelect(): void {
    var playlistDropdown = document.getElementById('playlist-choice')

    var first = document.createElement('option')
    first.textContent = 'None'
    first.value = '0'
    playlistDropdown.appendChild(first)

    for(let i = 0; i < this.myPlaylists.length; i++) {
      var element = document.createElement('option')
      element.textContent = this.myPlaylists[i].playlistName
      element.value = this.myPlaylists[i].playlistId.toString()
      playlistDropdown.appendChild(element)
    }
  }

  closeModal(): void {
    this.modalInfo.changeModal(false)
  }

  uploadYt() : void {
    this.user = JSON.parse(localStorage.getItem('users'))   

    this.private = document.querySelector('#private')
    this.unlisted = document.querySelector('#unlisted')
    this.public = document.querySelector('#public')
    this.yes = document.querySelector('#yes')
    this.no = document.querySelector('#no')
    var x = (<HTMLSelectElement>document.getElementById('vidCategory'))
    var y = (<HTMLSelectElement>document.getElementById('playlist-choice'))
    this.category = x.options[x.selectedIndex].value;
    this.playlistId = parseInt(y.options[y.selectedIndex].value)

    if(this.private.checked)
      this.visibility = "private"
    else if(this.public.checked)
      this.visibility = "public"
    else if(this.unlisted.checked)
      this.visibility = "unlisted"

    if(this.yes.checked)
      this.audience = "kids"
    else if(this.no.checked)
      this.audience =  "mature"

    if(this.playlistId == 0)
      this.toPlaylist = true
    else
      this.toPlaylist = false

    if(this.titleBox == "" || this.descriptionBox == "" || this.audience == "" || this.visibility == "" || this.downloadURL == null || this.imgDownloadURL == null) {
      alert('All fields must be filled')
      return;
    }
    else {
      this.time = new Date()
      this.day = this.time.getDate().toString()
      this.month = this.time.getMonth().toString()
      this.year = this.time.getFullYear().toString()
      this.uploadToDB();
      alert('success') 
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    const file = event.item(0)

    const path = `videos/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
        });
      })
    ).subscribe();
  }

  uploadImage(event: FileList) {
    
    const file = event.item(0)

    const path = `image/${new Date().getTime()}_${file.name}`;

    this.imgTask = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.imgPercentage = this.imgTask.percentageChanges();
    this.imgSnapshot = this.imgTask.snapshotChanges();

    this.imgTask.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.imgDownloadURL = url
        });
      })
    ).subscribe();
  }

  uploadToDB(): void {
    var date = new Date()
    this.apollo.mutate({
      mutation: gql`
       mutation insertVideo (
          $videoTitle: String!, 
          $videoDesc: String!, 
          $videoURL: String!
          $videoThumbnail: String!, 
          $uploadDay: String!, 
          $uploadMonth: String!, 
          $uploadYear: String!, 
          $views: Int!, 
          $likes: Int!, 
          $dislikes: Int!, 
          $visibility: String!, 
          $viewer: String!, 
          $category: String!, 
          $channelName: String!, 
          $channelPhotoURL: String!,
          $channelEmail: String!,
          $time: Int!
        ) {
          createVideo(input:{
            videoTitle: $videoTitle, 
            videoDesc: $videoDesc, 
            videoURL: $videoURL, 
            videoThumbnail: $videoThumbnail, 
            uploadDay: $uploadDay, 
            uploadMonth: $uploadMonth, 
            uploadYear: $uploadYear, 
            views: $views, 
            likes: $likes, 
            dislikes: $dislikes, 
            visibility: $visibility, 
            viewer: $viewer, 
            category: $category, 
            channelName: $channelName, 
            channelPhotoURL: $channelPhotoURL,
            channelEmail: $channelEmail,
            time: $time
          }) {
            videoId,
            videoTitle,
            videoDesc,
            videoURL,
            videoThumbnail,
            uploadDay,
            uploadMonth,
            uploadYear,
            views,
            likes,
            dislikes,
            visibility,
            viewer,
            category,
            channelName,
            channelPhotoURL,
            channelEmail,
            time,
          }
        }
      `,
      variables: {
        videoTitle: this.titleBox,
        videoDesc: this.descriptionBox,
        videoURL: this.downloadURL.toString(),
        videoThumbnail: this.imgDownloadURL.toString(),
        uploadDay: this.day,
        uploadMonth: this.month,
        uploadYear: this.year,
        views: 0,
        likes: 0,
        dislikes: 0,
        visibility: this.visibility,
        viewer: this.audience,
        category: this.category,
        channelName: this.user.name.toString(),
        channelPhotoURL: this.user.photoUrl.toString(),
        channelEmail: this.user.email.toString(),
        time: date.getTime(),
      }
    }).subscribe( result => {
      var content = (result as any).data.createVideo.channelName + " uploaded: " + (result as any).data.createVideo.videoTitle
      this.addNotification((result as any).data.createVideo.videoId, (result as any).data.createVideo.videoThumbnail, content)
    
      if(this.toPlaylist == true) {
        this.playlistVideoService.fetchPlaylistVideosById(this.playlistId).valueChanges.subscribe( result => {
          this.playlistVideos = result.data.playlistVideosById
          var date = new Date()
          var video: Videos
          video.channelEmail = ((result as any).data.createVideo.channelEmail)
          video.category = ((result as any).data.createVideo.category)
          video.channelName = ((result as any).data.createVideo.channelName)
          video.channelPhotoURL = ((result as any).data.createVideo.channelPhotoURL)
          video.dislikes = 0
          video.likes = 0
          video.time = ((result as any).data.createVideo.time)
          video.uploadDay = ((result as any).data.createVideo.uploadDay)
          video.uploadMonth = ((result as any).data.createVideo.uploadMonth)
          video.uploadYear = ((result as any).data.createVideo.uploadYear)
          video.videoDesc = ((result as any).data.createVideo.videoDesc)
          video.videoId = ((result as any).data.createVideo.videoId)
          video.videoThumbnail = ((result as any).data.createVideo.videoThumbnail)
          video.videoTitle = ((result as any).data.createVideo.videoTitle)
          video.videoURL = ((result as any).data.createVideo.videoURL)
          video.viewer = ((result as any).data.createVideo.viewer)
          video.views = 0
          video.visibility = ((result as any).data.createVideo.visibility)

          this.playlistVideoService.addPlaylistVideo(this.playlistId, video, date.getTime(), this.playlistVideos.length)
        })
      }
    })
  }

  addNotification(route: number, photoURL: string, content: string): void {
    this.notificationService.addNotification(this.loggedInChannel.id, route, photoURL, content, "video")
  }
}