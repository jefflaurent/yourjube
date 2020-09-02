import { Injectable } from '@angular/core';
import { Premiums } from '../model/premium';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class PremiumService {
    
    constructor(private apollo: Apollo) {}

    fetchAllPremiumQuery = gql`
        query premiums {
            premiumAccounts {
                id,
                channelId,
                startDate,
                startMonth,
                startYear,
                endDate,
                endMonth,
                endYear,
            }
        }
    `

    fetchAllPremium(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllPremiumQuery
        })
    }

    fetchPremiumById(channelId: number): any {
        console.log('test')
        return this.apollo.watchQuery<any>({
            query: gql`
                query findPremium($channelId: Int!) {
                    findPremiumAccount(channelId: $channelId) {
                        id,
                        channelId,
                        startDate,
                        startMonth,
                        startYear,
                        endDate,
                        endMonth,
                        endYear,
                    }
                }
            `,
            variables: {
                channelId: channelId
            }
        })
    }

    createPremium(type: string, channelId: number): void {
        var now = new Date()
        var startDate = now.getDate()
        var startMonth = now.getMonth()
        var startYear = now.getFullYear()

        if(type == 'month') {
            if(startMonth == 12) {
                var endMonth = 1
            }
            else {
                var endMonth = startMonth + 1
            }
            var endYear = now.getFullYear()
        }
        else {
            var endMonth = now.getMonth()
            var endYear = now.getFullYear() + 1
        }
        
        this.apollo.mutate({
            mutation: gql`
                mutation addPremium($channelId: Int!, $startDate: Int!, $startMonth: Int!, $startYear: Int!, $endDate: Int!, $endMonth: Int!, $endYear: Int!) {
                    addPremiumAccount(input: {
                        channelId: $channelId,
                        startDate: $startDate,
                        startMonth: $startMonth,
                        startYear: $startYear,
                        endDate: $endDate,
                        endMonth: $endMonth,
                        endYear: $endYear,
                    })
                }
            `,
            variables: {
                channelId: channelId,
                startDate: startDate,
                startMonth: startMonth,
                startYear: startYear,
                endDate: startDate,
                endMonth: endMonth,
                endYear: endYear,
            }
        }).subscribe()
    }
} 