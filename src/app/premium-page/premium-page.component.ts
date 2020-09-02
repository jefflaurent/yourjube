import { Component, OnInit } from '@angular/core';
import { PremiumService } from '../data-service/premium-service';
import { UserService } from '../data-service/user-service';
import { Premiums } from '../model/premium';
import { Channel } from '../model/channel';

@Component({
  selector: 'app-premium-page',
  templateUrl: './premium-page.component.html',
  styleUrls: ['./premium-page.component.scss']
})
export class PremiumPageComponent implements OnInit {
  
  user: any
  loggedInChannel: Channel
  isPremium: boolean
  premiums: Premiums[] = []
  endsIn: string

  constructor(private userService: UserService, private premiumService: PremiumService) { }

  ngOnInit(): void {
    var date = new Date()
    this.user = JSON.parse(localStorage.getItem('users'))
    this.userService.getUser(this.user.email).valueChanges.subscribe( result => {
      this.loggedInChannel = result.data.findChannel[0]

      if(this.loggedInChannel.validPremium < date.getTime())
        this.isPremium = false
      else 
        this.isPremium = true

      if(this.isPremium) {
        this.premiumService.fetchPremiumById(this.loggedInChannel.id).valueChanges.subscribe( result => {
          this.premiums = result.data.findPremiumAccount
          this.convertStart()
        })
      }
    })
  }

  registerMonth(): void {
    var date = new Date()
    this.premiumService.createPremium('month', this.loggedInChannel.id)
    this.userService.changePremium(this.loggedInChannel.id, date.getTime() + 2678400000)
  }
  
  registerYear(): void {
    var date = new Date()
    this.premiumService.createPremium('year', this.loggedInChannel.id)
    this.userService.changePremium(this.loggedInChannel.id, date.getTime() + 31536000000)
  }

  convertStart(): void {
    var month = ''
    if(this.premiums[this.premiums.length-1].endMonth == 1)
      month = 'Jan'
    else if(this.premiums[this.premiums.length-1].endMonth == 2)
      month = 'Feb'
    else if(this.premiums[this.premiums.length-1].endMonth == 3)
      month = 'Mar'
    else if(this.premiums[this.premiums.length-1].endMonth == 4)
      month = 'Apr'
    else if(this.premiums[this.premiums.length-1].endMonth == 5)
      month = 'May'
    else if(this.premiums[this.premiums.length-1].endMonth == 6)
      month = 'Jun'
    else if(this.premiums[this.premiums.length-1].endMonth== 7)
      month = 'Jul'
    else if(this.premiums[this.premiums.length-1].endMonth == 8)
      month = 'Aug'
    else if(this.premiums[this.premiums.length-1].endMonth == 9)
      month = 'Sep'
    else if(this.premiums[this.premiums.length-1].endMonth == 10)
      month = 'Oct'
    else if(this.premiums[this.premiums.length-1].endMonth == 11)
      month = 'Nov'
    else if(this.premiums[this.premiums.length-1].endMonth == 12)
      month = 'Dec'

    this.endsIn = month + ' ' + this.premiums[this.premiums.length-1].endDate + ', ' + this.premiums[this.premiums.length-1].endYear
  }
}
