import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from  'graphql-tag';

@Injectable()
export class PostService {

    constructor(private apollo: Apollo) {}

    fetchAllPostQuery = gql`
        query posts {
            posts {
                id,
                channelId,
                content,
                photoURL,
                likes,
                dislikes,
                time,
            }
        }
    `;

    fetchAllPostLikeQuery = gql`
        query postLikes {
            postLikes {
                id,
                channelId,
                postId,
            }
        }
    `;

    fetchAllPostDislikeQuery = gql`
        query postDislikes {
            postDislikes{
                id,
                channelId,
                postId,
            }
        }
    `;

    fetchAllPost(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllPostQuery 
        })
    }

    fetchAllPostLikes(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllPostLikeQuery
        })
    }

    fetchAllPostDislikes(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllPostDislikeQuery
        })
    }
    
    createPost(channelId: number, content: string, photoURL: string): void {
        var date = new Date()
        this.apollo.mutate({
            mutation: gql`
                mutation addPost($channelId: Int!, $content: String!, $photoURL: String! $likes: Int!, $dislikes: Int!, $time: Int!) {
                    addPost( input: {channelId: $channelId, content: $content, photoURL: $photoURL, likes: $likes, dislikes: $dislikes, time: $time}) {
                        id,
                        channelId,
                        content,
                        photoURL,
                        likes,
                        dislikes,
                        time,
                    }
                }
            `,
            variables: {
                channelId: channelId,
                content: content,
                photoURL: photoURL,
                likes: 0,
                dislikes: 0,
                time: date.getTime()
            },
            refetchQueries: [{
                query: this.fetchAllPostQuery
            }]
        }).subscribe()
    }

    likePost(postId: number, channelId: number): void {
        this.increasePostLike(postId)
        this.registerPostLike(channelId, postId)
    }

    unlikePost(postId: number, channelId: number): void {
        this.decreasePostLike(postId)
        this.removePostLike(postId, channelId)
    }

    dislikePost(postId: number, channelId: number): void {
        this.increasePostDislike(postId)
        this.registerPostDislike(channelId, postId)
    }

    undislikePost(postId: number, channelId: number): void {
        this.decreasePostDislike(postId)
        this.removePostDislike(postId, channelId)
    }

    increasePostLike(id: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation increasePostLike($id: ID!) {
                    increasePostLike(id: $id)
                }
            `,
            variables: {
                id: id
            },
            refetchQueries: [{
                query: this.fetchAllPostQuery
            }]
        }).subscribe()
    }

    decreasePostLike(id: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation decreasePostLike($id: ID!) {
                    decreasePostLike(id: $id)
                }
            `,
            variables: {
                id: id
            },
            refetchQueries: [{
                query: this.fetchAllPostQuery
            }]
        }).subscribe()
    }

    increasePostDislike(id: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation increasePostDislike($id: ID!) {
                    increasePostDislike(id: $id)
                }
            `,
            variables: {
                id: id
            },
            refetchQueries: [{
                query: this.fetchAllPostQuery
            }]
        }).subscribe()
    }

    decreasePostDislike(id: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation decreasePostDislike($id: ID!) {
                    decreasePostDislike(id: $id)
                }
            `,
            variables: {
                id: id
            },
            refetchQueries: [{
                query: this.fetchAllPostQuery
            }]
        }).subscribe()
    }

    registerPostLike(channelId: number, postId: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation registerPostLike($channelId: Int!, $postId: Int!) {
                    registerPostLike(input: {
                        channelId: $channelId,
                        postId: $postId
                    })
                }
            `,
            variables: {
                channelId: channelId,
                postId: postId
            }
        }).subscribe()
    }

    removePostLike(postId: number, channelId: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation removePostLike($postId: Int!, $channelId: Int!) {
                    removePostLike(postId: $postId, channelId: $channelId)
                }
            `,
            variables: {
                postId: postId,
                channelId: channelId
            }
        }).subscribe()
    }

    registerPostDislike(channelId: number, postId: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation registerPostDislike($channelId: Int!, $postId: Int!) {
                    registerPostDislike(input: {
                        channelId: $channelId,
                        postId: $postId
                    })
                }
            `,
            variables: {
                channelId: channelId,
                postId: postId
            }
        }).subscribe()
    }

    removePostDislike(postId: number, channelId: number): void {
        this.apollo.mutate({
            mutation: gql`
                mutation removePostDislike($postId: Int!, $channelId: Int!) {
                    removePostDislike(postId: $postId, channelId: $channelId)
                }
            `,
            variables: {
                postId: postId,
                channelId: channelId
            }
        }).subscribe()
    }
}