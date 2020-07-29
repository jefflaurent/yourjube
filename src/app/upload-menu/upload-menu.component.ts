import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { Apollo } from'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styleUrls: ['./upload-menu.component.scss']
})
export class UploadMenuComponent implements OnInit {

  @Input() header: HeaderComponent;
  
  ngOnInit(){}
  
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

  constructor(private storage: AngularFireStorage, private apollo: Apollo) { }

  uploadYt() : void {
    this.user = JSON.parse(localStorage.getItem('users'))   

    this.private = document.querySelector('#private')
    this.unlisted = document.querySelector('#unlisted')
    this.public = document.querySelector('#public')
    this.yes = document.querySelector('#yes')
    this.no = document.querySelector('#no')
    var x = (<HTMLSelectElement>document.getElementById('vidCategory'))
    this.category = x.options[x.selectedIndex].value;

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
          this.imgDownloadURL = url;
        });
      })
    ).subscribe();
  }

  uploadToDB(): void {
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
          }) {
            videoTitle,
            videoURL,
            videoThumbnail,
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
      }
    }).subscribe( result => {
      console.log(result)
    })
  }  
}