import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class NotificationService {
    
    constructor(private apollo: Apollo) { }

    fetchAllBellQuery = gql`
        query bells {
            bells {
                id,
                clientId,
                channelId
            }
        }
    `;

    fetchAllNotificationQuery = gql`
        query notifications {
            notifications {
                id,
                channelId,
                route,
                photoURL,
                content,
                type,
                time,
            }
        }
    `

    fetchAllBells(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllBellQuery
        })
    }

    fetchAllNotifications(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllNotificationQuery
        })
    }

    addBell(clientId: number, channelId: number): void {
        this.apollo.mutate({ 
            mutation: gql`
                mutation addBell($clientId: Int!, $channelId: Int!) {
                    addBell(input: {
                        clientId: $clientId,
                        channelId: $channelId
                    }) {
                        id,
                        clientId,
                        channelId
                    }
                }
            `,
            variables: {
                clientId: clientId,
                channelId: channelId,
            },
            refetchQueries: [{
                query: this.fetchAllBellQuery
            }]
        }).subscribe()
    }

    deleteBell(clientId: number, channelId: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation deleteBell($clientId: Int!, $channelId: Int!) {
                    deleteBell(clientId: $clientId, channelId: $channelId)
                }
            `,
            variables: {
                clientId: clientId,
                channelId: channelId
            },
            refetchQueries: [{
                query: this.fetchAllBellQuery
            }]
        }).subscribe()
    }

    addNotification(channelId: number, route: number, photoURL: string, content: string, type: string): void {
        var date = new Date()
        this.apollo.mutate({ 
            mutation: gql`
                mutation addNotification($channelId: Int!, $route: Int!, $photoURL: String!, $content: String! $type: String!, $time: Int!) {
                    addNotification(input: {
                        channelId: $channelId,
                        route: $route,
                        photoURL: $photoURL,
                        content: $content,
                        type: $type,
                        time: $time
                    }) {
                        channelId,
                        route,
                        photoURL,
                        content,
                        type,
                        time,
                    }
                }
            `,
            variables: {
                channelId: channelId, 
                route: route,
                photoURL: photoURL,
                content: content,
                type: type,
                time: date.getTime()
            },
            refetchQueries: [{
                query: this.fetchAllNotificationQuery
            }]
        }).subscribe()
    }
}