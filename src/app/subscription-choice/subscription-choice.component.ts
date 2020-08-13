import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-choice',
  templateUrl: './subscription-choice.component.html',
  styleUrls: ['./subscription-choice.component.scss']
})
export class SubscriptionChoiceComponent implements OnInit {

  @Input('subs') subscription: {
    id: number
    clientEmail: string     
    channelId: number 
    channelName: string
    channelEmail: string 
    channelPhotoURL: string
  }
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.subscription)
  }

}
