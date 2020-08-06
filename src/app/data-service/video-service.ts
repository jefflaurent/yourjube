import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Videos } from '../model/video'; 
import gql from 'graphql-tag';

@Injectable()
export class VideoService {
    
    constructor(private apollo: Apollo) {}

    fetchAllVideosQuery = gql`
        query getVideos {
            videos {
                videoId,
                videoTitle,
                videoDesc,
                videoURL,
                videoThumbnail,
                uploadDay,
                uploadMonth,
                uploadYear,
                views,
                likes,
                dislikes,
                visibility,
                viewer,
                category,
                channelName,
                channelPhotoURL,
                channelEmail,
                time,
            }
        }
    `;

    findVideo(videoId: any) {
        return this.apollo.watchQuery<any>({
            query: gql`
                query findVideo($videoId: ID!) {
                    findVideo(videoId: $videoId) {
                        videoId,
                        videoTitle,
                        videoDesc,
                        videoURL,
                        videoThumbnail,
                        uploadDay,
                        uploadMonth,
                        uploadYear,
                        views,
                        likes,
                        dislikes,
                        visibility,
                        viewer,
                        category,
                        channelName,
                        channelPhotoURL,
                        channelEmail,
                        time
                    }
                }
            `,
            variables: {
                videoId: videoId
            }
        })
    }

    watchVideo(videoId: any): void {
        this.apollo.mutate({
          mutation: gql`
            mutation watch($videoId: ID!){
              watchVideo(videoId: $videoId)
            }
          `,
          variables: {
            videoId: videoId
          },
          refetchQueries: [{
            query: this.fetchAllVideosQuery,
            variables: { repoFullName: 'apollographql/apollo-client' },
          }],
        }).subscribe()
      }

    fetchAllVideos(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllVideosQuery
        })
    }

    checkLiked(videoId: any, channelEmail: any): any {
        return this.apollo.watchQuery<any>({
          query: gql`
          query find ($channelEmail: String!, $videoId: Int!){
            findLike(email: $channelEmail, videoId: $videoId) {
              channelId,
              channelEmail,
              videoId,
              videoThumbnail,
              videoURL,
            }
          }
          `,
          variables: {
            videoId: videoId,
            channelEmail: channelEmail,
          }
        })
    }

    checkDisliked(videoId: any, channelEmail: any): any {
        return this.apollo.watchQuery<any>({
          query: gql`
          query find ($channelEmail: String!, $videoId: Int!){
            findDislike(email: $channelEmail, videoId: $videoId) {
              channelId,
              channelEmail,
              videoId,
              videoThumbnail,
              videoURL,
            }
          }
          `,
          variables: {
            videoId: videoId,
            channelEmail: channelEmail
          }
        })
    }

    //changing value
    increaseLike(videoId: any): void {
      this.apollo.mutate({
        mutation: gql`
          mutation increase($videoId: ID!){
            likeVideo(videoId: $videoId)
          }
        `,
        variables: {
          videoId: videoId
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    decreaseLike(videoId: any): void{
      this.apollo.mutate({
        mutation: gql`
          mutation decrease($videoId: ID!){
            decreaseLike(videoId: $videoId)
          }
        `,
        variables: {
          videoId: videoId
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery
        }],
      }).subscribe()
    }

    increaseDislike(videoId: any): void {
      this.apollo.mutate({
        mutation: gql`
          mutation increase($videoId: ID!){
            dislikeVideo(videoId: $videoId)
          }
        `,
        variables: {
          videoId: videoId
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    decreaseDislike(videoId: any): void{
      this.apollo.mutate({
        mutation: gql`
          mutation decrease($videoId: ID!){
            decreaseDislike(videoId: $videoId)
          }
        `,
        variables: {
          videoId: videoId
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    //registering
    addLike(user: any, video: Videos): void{
      this.apollo.mutate({
        mutation: gql`
          mutation add($channelId: Int!, $channelEmail: String!, $videoId: Int!, $videoThumbnail: String!, $videoURL: String!){
            addLike(input: {
              channelId: $channelId,
              channelEmail: $channelEmail,
              videoId: $videoId,
              videoThumbnail: $videoThumbnail,
              videoURL: $videoURL,
            }) {
              channelId,
              channelEmail,
              videoId,
              videoThumbnail,
              videoURL,
            }
          }
        `,
        variables: {
          channelId: user.id,
          channelEmail: user.email,
          videoId: video.videoId, 
          videoThumbnail: video.videoThumbnail,
          videoURL: video.videoURL,
        },
      }).subscribe()
    }

    removeLike(user: any, videoId: any): void {
      this.apollo.mutate({
        mutation: gql`
          mutation remove($channelId: Int!, $videoId: Int!) {
            removeLike(channelId: $channelId, videoId: $videoId)
          }
        `,
        variables: {
          channelId: user.id,
          videoId: videoId
        }
      }).subscribe()
    }

    addDislike(user: any, video: Videos): void{
      this.apollo.mutate({
        mutation: gql`
          mutation add($channelId: Int!, $channelEmail: String!, $videoId: Int!, $videoThumbnail: String!, $videoURL: String!){
            addDislike(input: {
              channelId: $channelId,
              channelEmail: $channelEmail,
              videoId: $videoId,
              videoThumbnail: $videoThumbnail,
              videoURL: $videoURL,
            }) {
              channelId,
              channelEmail,
              videoId,
              videoThumbnail,
              videoURL,
            }
          }
        `,
        variables: {
          channelId: user.id,
          channelEmail: user.email,
          videoId: video.videoId, 
          videoThumbnail: video.videoThumbnail,
          videoURL: video.videoURL,
        }
      }).subscribe()
    }

    removeDislike(user: any, videoId): void {
      this.apollo.mutate({
        mutation: gql`
          mutation remove($channelId: Int!, $videoId: Int!) {
            removeDislike(channelId: $channelId, videoId: $videoId)
          }
        `,
        variables: {
          channelId: user.id,
          videoId: videoId
        }
      }).subscribe()
    }
}