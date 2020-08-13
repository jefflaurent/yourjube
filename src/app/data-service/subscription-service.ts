import { Injectable } from '@angular/core';
import { Channel } from '../model/channel';
import { Apollo } from 'apollo-angular';
import gql from  'graphql-tag';


@Injectable()
export class SubscriptionService {

    constructor(private apollo: Apollo) {}

    fetchAllSubsQuery = gql`
        query subscriptions {
            subscriptions {
                id,
                clientEmail,
                channelId,
                channelName,
                channelEmail,
                channelPhotoURL,
            }
        }
    `;

    fetchAllSubs(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllSubsQuery
        })
    }

    registerSubs(clientEmail: string, channel: Channel): void {
        this.apollo.mutate({
            mutation: gql`
                mutation registerSubs(
                    $clientEmail: String!,
                    $channelId: Int!,
                    $channelName: String!,
                    $channelEmail: String!,
                    $channelPhotoURL: String!
                ) {
                    addSubscription(input: {
                        clientEmail: $clientEmail,
                        channelId: $channelId,
                        channelName: $channelName,
                        channelEmail: $channelEmail,
                        channelPhotoURL: $channelPhotoURL,
                    }) {
                        clientEmail,
                        channelId,
                        channelName,
                        channelEmail,
                        channelPhotoURL,
                    }
                }
            `,
            variables: {
                clientEmail: clientEmail,
                channelId: channel.id,
                channelName: channel.name,
                channelEmail: channel.email,
                channelPhotoURL: channel.photoURL
            },
            refetchQueries:[{
                query: this.fetchAllSubsQuery
            }]
        }).subscribe()
    }

    removeSubs(clientEmail: String, channelEmail: String): void {
        this.apollo.mutate({
            mutation: gql`
                mutation removeSubs($clientEmail: String!, $channelEmail: String!) {
                    removeSubscription(clientEmail: $clientEmail, channelEmail: $channelEmail)
                }
            `,
            variables: {
                clientEmail: clientEmail,
                channelEmail: channelEmail,
            },
            refetchQueries:[{
                query: this.fetchAllSubsQuery
            }]
        }).subscribe()
    }
}