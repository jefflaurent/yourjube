import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../data-service/user-service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
 
@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

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

  description: string
  temp: string
  twitter: string
  instagram: string
  facebook: string
  twitterBefore: string
  instagramBefore: string
  facebookBefore: string
  twitterTemp: string
  instagramTemp: string
  facebookTemp: string
  post: string
  m: string

  profileTask: AngularFireUploadTask;
  bannerTask: AngularFireUploadTask;

  profilePercentage: Observable<number>
  bannerPercentage: Observable<number>
  
  profileSnapshot: Observable<any>
  bannerSnapshot: Observable<any>

  profileURL: Observable<string>
  bannerURL: Observable<string>

  constructor(private userService: UserService, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.processDate()
    this.description = this.channel.channelDescription
    this.twitter = this.twitterBefore =this.channel.twitter
    this.facebook = this.facebookBefore = this.channel.facebook
    this.instagram = this.instagramBefore = this.channel.instagram
  }

  toggleOnDescBox(): void {
    this.temp = this.description
    var x = document.querySelector('.input-desc')
    var y = document.querySelector('.desc-button')
    x.classList.remove('hidden')
    y.classList.add('hidden')
  }

  toggleOffDescBox(): void {
    var x = document.querySelector('.input-desc')
    var y = document.querySelector('.desc-button')
    x.classList.add('hidden')
    y.classList.remove('hidden')
  }

  cancelUpdate(): void {
    this.toggleOffDescBox()
    this.description = this.temp
  }

  toggleOnLinkBox(): void {
    this.saveToTemp()
    var x = document.querySelector('.link-toggler')
    var y = document.querySelector('.links-list')
    x.classList.add('hidden')
    y.classList.remove('hidden')
  }

  toggleOffLinkBox(): void {
    var x = document.querySelector('.link-toggler')
    var y = document.querySelector('.links-list')
    x.classList.remove('hidden')
    y.classList.add('hidden')
  }

  saveToTemp(): void {
    this.twitterTemp = this.twitter
    this.facebookTemp = this.facebook
    this.instagramTemp = this.instagram
  }

  returnFromTemp(): void {
    this.twitter = this.twitterTemp
    this.facebook = this.facebookTemp
    this.instagram = this.instagramTemp
  }

  cancelLink(): void {
    this.returnFromTemp()
    this.toggleOffLinkBox()
  }

  changeDescription(): void {
    this.userService.changeDescription(this.channel.id, this.description)
    this.toggleOffDescBox()
  }

  changeLinks(): void {
    if(this.twitterBefore != this.twitter)
      this.userService.changeTwitter(this.channel.id, this.twitter)
    if(this.instagramBefore != this.instagram)
      this.userService.changeInstagram(this.channel.id, this.instagram)
    if(this.facebookBefore != this.facebook)
      this.userService.changeFacebook(this.channel.id, this.facebook)

    this.toggleOffLinkBox()
  }

  cancelUploadProfile(): void {
    this.profileURL = null
  }

  changeIcon(): void {
    this.userService.changeProfile(this.channel.id, this.profileURL.toString())
    this.profileURL = null
  }

  cancelUploadBanner(): void {
    this.bannerURL = null
  }

  changeBanner(): void {
    this.userService.changeBanner(this.channel.id, this.bannerURL.toString())
    this.bannerURL = null
  }

  processDate(): void {
    var date = new Date()
      if(this.channel.joinMonth == 1)
        this.m = 'Jan'
      else if(this.channel.joinMonth== 2)
        this.m = 'Feb'
      else if(this.channel.joinMonth == 3)
        this.m = 'Mar'
      else if(this.channel.joinMonth == 4)
        this.m = 'Apr'
      else if(this.channel.joinMonth == 5)
        this.m = 'May'
      else if(this.channel.joinMonth == 6)
        this.m = 'Jun'
      else if(this.channel.joinMonth == 7)
        this.m = 'Jul'
      else if(this.channel.joinMonth == 8)
        this.m = 'Aug'
      else if(this.channel.joinMonth == 9)
        this.m = 'Sep'
      else if(this.channel.joinMonth == 10)
        this.m = 'Oct'
      else if(this.channel.joinMonth == 11)
        this.m = 'Nov'
      else if(this.channel.joinMonth == 12)
        this.m = 'Dec'
      this.post = 'Joined ' + this.m + ' ' + this.channel.joinDate + ', ' + this.channel.joinYear
  }

  uploadProfile(event: FileList) {
    const file = event.item(0)

    const path = `profile/${new Date().getTime()}_${file.name}`;

    this.profileTask = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.profilePercentage = this.profileTask.percentageChanges();
    this.profileSnapshot = this.profileTask.snapshotChanges();

    this.profileTask.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.profileURL = url;
        });
      })
    ).subscribe();
  }

  uploadBanner(event: FileList) {
    const file = event.item(0)

    const path = `banner/${new Date().getTime()}_${file.name}`;

    this.bannerTask = this.storage.upload(path, file)
    const ref = this.storage.ref(path);

    this.bannerPercentage = this.bannerTask.percentageChanges();
    this.bannerSnapshot = this.bannerTask.snapshotChanges();

    this.bannerTask.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.bannerURL = url;
        });
      })
    ).subscribe();
  }
}
