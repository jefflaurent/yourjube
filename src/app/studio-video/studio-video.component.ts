import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { VideoService } from '../data-service/video-service';
import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-studio-video',
  templateUrl: './studio-video.component.html',
  styleUrls: ['./studio-video.component.scss']
})
export class StudioVideoComponent implements OnInit {

  @Input('vid') video: {
    videoId: BigInteger,        
    videoTitle: string,  
    videoDesc: string,
    videoURL: string,
    videoThumbnail: string,
    uploadDay: string,
    uploadMonth: string,
    uploadYear: string,
    views: number,
    likes: number,     
    dislikes: number,      
    visibility: string,    
    viewer: string,       
    category: string,      
    channelName: string,
    channelPhotoURL: string,
    channelEmail: string,
    time: number,
  }

  space: string
  dummyId: string
  dummyId2: string
  dummyId3: string
  dummyId4: string
  dummyId5: string
  dummyId6: string
  dummyId7: string
  dummyId8: string
  dummyId9: string
  title: string
  description: string
  visibility: string
  titleTemp: string
  descriptionTemp: string

  task: AngularFireUploadTask
  percentage: Observable<number>
  snapshot: Observable<any>
  url: Observable<string>

  constructor(private storage: AngularFireStorage, private videoService: VideoService) { }

  ngOnInit(): void {
    this.space = " "
    this.titleTemp = this.video.videoTitle
    this.descriptionTemp = this.video.videoDesc
    
    this.dummyId = 'vsc' + this.video.videoId
    this.dummyId2 = 'sht' + this.video.videoId
    this.dummyId3 = 'int' + this.video.videoId
    this.dummyId4 = 'shd' + this.video.videoId
    this.dummyId5 = 'ind' + this.video.videoId
    this.dummyId6 = 'ccb' + this.video.videoId
    this.dummyId7 = 'img' + this.video.videoId
    this.dummyId8 = 'del' + this.video.videoId
    this.dummyId9 = 'mod' + this.video.videoId

    if(this.video.visibility == 'public')
      this.visibility = 'Public'
    else if(this.video.visibility == 'private')
      this.visibility = 'Private'

    this.description = ""
    this.processDesc()
  }

  processDesc(): void {
    if(this.video.videoDesc.length > 100) {
      for(let i = 0; i < 97; i++) {
        this.description += this.video.videoDesc.charAt(i)
      }
      this.description += '...'
    }
    else {
      this.description = this.video.videoDesc
    }
  }

  changeVideoVisibility(visibility: string): void {
    this.videoService.changeVideoVisibility(parseInt(this.video.videoId.toString()), visibility)
  }

  toggleModal(): void {
    var query = '#' + this.dummyId
    var x = document.querySelector(query)
    x.classList.toggle('hidden')
  }

  toggleEdit(): void {
    var query1 = '#' + this.dummyId2
    var query2 = '#' + this.dummyId3
    var query3 = '#' + this.dummyId4
    var query4 = '#' + this.dummyId5
    var query5 = '#' + this.dummyId6
    var x = document.querySelector(query1)
    var y = document.querySelector(query2)
    var xx = document.querySelector(query3)
    var yy = document.querySelector(query4)
    var z = document.querySelector(query5)

    console.log(yy)
    x.classList.toggle('hidden')
    y.classList.toggle('hidden')
    xx.classList.toggle('hidden')
    yy.classList.toggle('hidden')
    z.classList.toggle('hidden')
  }

  openEditor(): void {
    this.titleTemp = this.video.videoTitle
    this.descriptionTemp = this.video.videoDesc

    this.toggleEdit()
  }

  saveChanges(): void {
    this.videoService.changeVideoTitle(parseInt(this.video.videoId.toString()), this.titleTemp)
    this.videoService.changeVideoDescription(parseInt(this.video.videoId.toString()), this.descriptionTemp)
  
    this.toggleEdit()
  }

  toggleDeleteModal(): void {
    var query = '#' + this.dummyId9
    var x = document.querySelector(query)
    x.classList.toggle('hidden')
  }

  deleteVideo(): void {
    this.videoService.deleteVideo(parseInt(this.video.videoId.toString()))
    this.toggleDeleteModal()
  }

  uploadImage(event: FileList) {
    console.log("test")
    const file = event.item(0)

    const path = `image/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.videoService.changeVideoThumbnail(parseInt(this.video.videoId.toString()), url.toString())
        });
      })
    ).subscribe();
  }
}
