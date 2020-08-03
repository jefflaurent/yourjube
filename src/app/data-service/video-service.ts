import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
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
                    }
                }
            `,
            variables: {
                videoId: videoId
            }
        })
    }

    fetchAllVideos(): any {
        return this.apollo.watchQuery<any>({
            query: this.fetchAllVideosQuery
        })
    }
}