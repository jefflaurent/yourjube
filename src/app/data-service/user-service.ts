import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class UserService {
    
    constructor(private apollo: Apollo) {}

    getAllChannelQuery = gql `
      query channels {
        channels {
          id,
          name,
          email,
          photoURL,
          bannerURL,
          subscriber,
          isPremium,
        }
      }
    `;


    getUser(email: string): any {
      return this.apollo.watchQuery<any>({
        query: gql`
          query getOne ($email: String!){
            findChannel(email: $email){
              id,
              name,
              email,
              photoURL,
              bannerURL,
              subscriber,
              isPremium,
            }
          }
        `, 
        variables: {
          email: email
        }
      })
    }

    getAllChannel(): any {
      return this.apollo.watchQuery<any>({
        query: this.getAllChannelQuery
      })
    }

    increaseSubscriber(channelId: any): void {
      this.apollo.mutate({
          mutation: gql`
              mutation increaseSubs($id: ID!) {
                increaseSubscriber(id: $id)
              }
          `,
          variables: {
            id: channelId
          },
          refetchQueries:[{
            query: this.getAllChannelQuery
          }]
      }).subscribe()
    }

    decreaseSubscriber(channelId: any): void {
      this.apollo.mutate({
        mutation: gql`
            mutation decreaseSubs($id: ID!) {
              decreaseSubscriber(id: $id)
            }
        `,
        variables: {
            id: channelId
        },
        refetchQueries:[{
          query: this.getAllChannelQuery
        }]
      }).subscribe()
    }

    searchUser(channelName: string): any {
      return this.apollo.watchQuery<any>({
        query: gql`
          query searchChannel($channelName: String!) {
            searchChannel(channelName: $channelName) {
              id,
              name,
              email,
              photoURL,
              bannerURL,
              subscriber,
              isPremium,
            }
          }
        `,
        variables: {
          channelName: channelName
        }
      })
    }
}