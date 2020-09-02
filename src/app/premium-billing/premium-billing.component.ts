import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-premium-billing',
  templateUrl: './premium-billing.component.html',
  styleUrls: ['./premium-billing.component.scss']
})
export class PremiumBillingComponent implements OnInit {

  @Input('bill') premium: {
    id: number
    channelId: number
    startDate: number
    startMonth: number
    startYear: number
    endDate: number
    endMonth: number
    endYear: number
  }

  startBill: string
  endBill: string

  constructor() { }

  ngOnInit(): void {
    this.convertStart()
    this.convertEnd()
  }

  convertStart(): void {
    var month = ''
    if(this.premium.startMonth == 1)
      month = 'Jan'
    else if(this.premium.startMonth == 2)
      month = 'Feb'
    else if(this.premium.startMonth == 3)
      month = 'Mar'
    else if(this.premium.startMonth == 4)
      month = 'Apr'
    else if(this.premium.startMonth == 5)
      month = 'May'
    else if(this.premium.startMonth == 6)
      month = 'Jun'
    else if(this.premium.startMonth == 7)
      month = 'Jul'
    else if(this.premium.startMonth == 8)
      month = 'Aug'
    else if(this.premium.startMonth == 9)
      month = 'Sep'
    else if(this.premium.startMonth== 10)
      month = 'Oct'
    else if(this.premium.startMonth == 11)
      month = 'Nov'
    else if(this.premium.startMonth == 12)
      month = 'Dec'

    this.startBill = month + ' ' + this.premium.startDate + ', ' + this.premium.startYear
  }

  convertEnd(): void {
    var month = ''
    if(this.premium.endMonth == 1)
      month = 'Jan'
    else if(this.premium.endMonth == 2)
      month = 'Feb'
    else if(this.premium.endMonth == 3)
      month = 'Mar'
    else if(this.premium.endMonth == 4)
      month = 'Apr'
    else if(this.premium.endMonth == 5)
      month = 'May'
    else if(this.premium.endMonth == 6)
      month = 'Jun'
    else if(this.premium.endMonth == 7)
      month = 'Jul'
    else if(this.premium.endMonth == 8)
      month = 'Aug'
    else if(this.premium.endMonth == 9)
      month = 'Sep'
    else if(this.premium.endMonth== 10)
      month = 'Oct'
    else if(this.premium.endMonth == 11)
      month = 'Nov'
    else if(this.premium.endMonth == 12)
      month = 'Dec'

    this.endBill = month + ' ' + this.premium.endDate + ', ' + this.premium.endYear
  }
}
