import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class UserService {
    
    constructor(private apollo: Apollo) {}

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
}