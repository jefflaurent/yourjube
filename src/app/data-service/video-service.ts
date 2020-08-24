import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Videos } from '../model/video'; 
import { BehaviorSubject } from 'rxjs';
import gql from 'graphql-tag';

@Injectable()
export class VideoService {
    
    private playlistId = new BehaviorSubject<number>(0)
    currentPlaylistId = this.playlistId.asObservable()

    private restrictMode = new BehaviorSubject<boolean>(false)
    currentStatus = this.restrictMode.asObservable()

    private fromPlaylist = new BehaviorSubject<boolean>(false)
    isFromPlaylist = this.fromPlaylist.asObservable()

    changeStatus(status: boolean): void {
      this.restrictMode.next(status)
    }

    changeFromPlaylist(status: boolean): void {
      this.fromPlaylist.next(status)
      console.log(this.isFromPlaylist)
    }

    changePlaylistId(playlistId: number): void {
      this.playlistId.next(playlistId)
    }
    
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

    searchVideo(videoTitle: string): any {
      return this.apollo.watchQuery<any>({ 
        query: gql`
          query searchVideo($videoTitle: String!) {
            searchVideo(videoTitle: $videoTitle) {
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
        `,
        variables: {
          videoTitle: videoTitle
        }
      })
    }

    searchRelatedVideo(query: string): any {
      return this.apollo.watchQuery<any>({ 
        query: gql`
          query searchVideo($videoTitle: String!) {
            searchVideo(videoTitle: $videoTitle) {
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
        `,
        variables: {
          videoTitle: '%' + query + '%'
        }
      })
    } 

    changeVideoTitle(videoId: number, videoTitle: string): void {
      this.apollo.mutate({
        mutation: gql`
          mutation changeVideoTitle($videoId: ID!, $videoTitle: String!) {
            changeVideoTitle(videoId: $videoId, videoTitle: $videoTitle)
          }
        `,
        variables: {
          videoId: videoId,
          videoTitle: videoTitle,
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    changeVideoDescription(videoId: number, videoDesc: string): void {
      this.apollo.mutate({
        mutation: gql`
          mutation changeVideoDescription($videoId: ID!, $videoDesc: String!) {
            changeVideoDescription(videoId: $videoId, videoDesc: $videoDesc)
          }
        `,
        variables: {
          videoId: videoId,
          videoDesc: videoDesc,
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    changeVideoThumbnail(videoId: number, videoThumbnail: string): void {
      this.apollo.mutate({
        mutation: gql`
          mutation changeVideoThumbnail($videoId: ID!, $videoThumbnail: String!) {
            changeVideoThumbnail(videoId: $videoId, videoThumbnail: $videoThumbnail)
          }
        `,
        variables: {
          videoId: videoId,
          videoThumbnail: videoThumbnail,
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    changeVideoVisibility(videoId: number, visibility: string): void {
      this.apollo.mutate({
        mutation: gql`
          mutation changeVisibility($videoId: ID!, $visibility: String!) {
            changeVideoVisibility(videoId: $videoId, visibility: $visibility)
          }
        `,
        variables: {
          videoId: videoId,
          visibility: visibility,
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }

    deleteVideo(videoId: number): void {
      this.apollo.mutate({
        mutation: gql`
          mutation deleteVideo($videoId: ID!) {
            deleteVideo(videoId: $videoId)
          }
        `,
        variables: {
          videoId: videoId,
        },
        refetchQueries: [{
          query: this.fetchAllVideosQuery,
        }],
      }).subscribe()
    }
}