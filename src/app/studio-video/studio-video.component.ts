import { Component, OnInit, Input } from '@angular/core';

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
  title: string
  description: string
  visibility: string

  constructor() { }

  ngOnInit(): void {
    this.space = " "

    this.dummyId = 'vsc' + this.video.videoId
    this.dummyId2 = 'sht' + this.video.videoId
    this.dummyId3 = 'int' + this.video.videoId
    this.dummyId4 = 'shd' + this.video.videoId
    this.dummyId5 = 'ind' + this.video.videoId

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
    var x = document.querySelector(query1)
    var y = document.querySelector(query2)
    var xx = document.querySelector(query3)
    var yy = document.querySelector(query4)

    console.log(yy)
    x.classList.toggle('hidden')
    y.classList.toggle('hidden')
    xx.classList.toggle('hidden')
    yy.classList.toggle('hidden')
  }
}
