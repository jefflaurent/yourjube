import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Channel } from '../model/channel';

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
            joinDate,
            joinMonth,
            joinYear,
            channelDescription,
            isMature,
            twitter,
            facebook,
            instagram,
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

  register(name: string, email: string, photoURL: string): void {
    var date = new Date()
    this.apollo.mutate({
      mutation: gql`
        mutation insert($name: String!, $email: String!, $photoURL: String!, $bannerURL: String!, $subscriber: Int!, $isPremium: String!, $joinDate: Int!, $joinMonth: Int!, $joinYear: Int!, $channelDescription: String!, $isMature: String!, $twitter: String!, $facebook: String!, $instagram: String!, $validPremium: Int!){
          createChannel(input:{ name: $name, email: $email, photoURL: $photoURL,bannerURL: $bannerURL, subscriber: $subscriber, isPremium: $isPremium, joinDate: $joinDate, joinMonth: $joinMonth, joinYear: $joinYear, channelDescription: $channelDescription, isMature: $isMature, twitter: $twitter, facebook: $facebook, instagram: $instagram, validPremium: $validPremium}) {
            name, 
            email,
            photoURL,
            bannerURL,
            subscriber,
            isPremium
          }
        }
      `,
      variables: {
        name: name,
        email: email,
        photoURL: photoURL,
        bannerURL: 'http',
        subscriber: 0,
        isPremium: 'false',
        joinDate: date.getDate(),
        joinMonth: date.getMonth(),
        joinYear: date.getFullYear(),
        channelDescription: 'No description',
        isMature: 'false',
        twitter: '',
        facebook: '',
        instagram: '',
        validPremium: 0,
      }
    }).subscribe()
  }

  changeDescription(channelId: number, description: string): void {
    this.apollo.mutate({ 
      mutation: gql`
        mutation changeDescription($id: ID!, $channelDescription: String!) {
          changeDescription(id: $id, channelDescription: $channelDescription) 
        }
      `,
      variables: {
        id: channelId,
        channelDescription: description
      },
      refetchQueries:[{
        query: this.getAllChannelQuery
      }]
    }).subscribe()
  }

  changeTwitter(channelId: number, twitter: string): void {
    this.apollo.mutate({ 
      mutation: gql`
        mutation changeTwitter($id: ID!, $twitter: String!) {
          changeTwitter(id: $id, twitter: $twitter) 
        }
      `,
      variables: {
        id: channelId,
        twitter: twitter
      },
      refetchQueries:[{
        query: this.getAllChannelQuery
      }]
    }).subscribe()
  }

  changeInstagram(channelId: number, instagram: string): void {
    this.apollo.mutate({ 
      mutation: gql`
        mutation changeInstagram($id: ID!, $instagram: String!) {
          changeInstagram(id: $id, instagram: $instagram) 
        }
      `,
      variables: {
        id: channelId,
        instagram: instagram
      },
      refetchQueries:[{
        query: this.getAllChannelQuery
      }]
    }).subscribe()
  }

  changeFacebook(channelId: number, facebook: string): void {
    this.apollo.mutate({ 
      mutation: gql`
        mutation changeFacebook($id: ID!, $facebook: String!) {
          changeFacebook(id: $id, facebook: $facebook) 
        }
      `,
      variables: {
        id: channelId,
        facebook: facebook
      },
      refetchQueries:[{
        query: this.getAllChannelQuery
      }]
    }).subscribe()
  }
}