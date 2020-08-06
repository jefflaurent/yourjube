import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class CommentService {

  constructor(private apollo: Apollo){}

  getCommentQuery = gql`
  query getComments($videoId: Int!){
      comments(videoId: $videoId) {
        commentId,
        videoId,
        channelId,
        channelName,
        channelEmail,
        channelPhotoURL,
        content,
        replyTo,
        likes,
        dislikes,
        day,
        month,
        year,
        replies,
        time
      }
    }
  `;

  addComment(videoId: any, user: any, content: any, replyTo: any): void {
    var date = new Date()
    this.apollo.mutate({
      mutation: gql`
        mutation createComment(
          $videoId: Int!, 
          $channelId: Int!,
          $channelName: String!,
          $channelEmail: String!,
          $channelPhotoURL: String!,
          $content: String!,
          $replyTo: Int!,
          $likes: Int!,
          $dislikes: Int!,
          $day: Int!,
          $month: Int!,
          $year: Int!,
          $replies: Int!,
          $time: Int!,
        ) {
          addComment(input: {
            videoId: $videoId,
            channelId: $channelId,
            channelName: $channelName,
            channelEmail: $channelEmail,
            channelPhotoURL: $channelPhotoURL,
            content: $content,
            replyTo: $replyTo,
            likes: $likes,
            dislikes: $dislikes,
            day: $day,
            month: $month,
            year: $year,
            replies: $replies,
            time: $time,
          }) {
            videoId,
            channelId,
            channelName,
            channelEmail,
            channelPhotoURL,
            content,
            replyTo,
            likes,
            dislikes,
            day,
            month,
            year,
            replies,
            time,
          }
        }
      `,
      variables: {
        videoId: videoId,
        channelId: user.id,
        channelName: user.name,
        channelEmail: user.email,
        channelPhotoURL: user.photoURL,
        content: content,
        replyTo: replyTo,
        likes: 0,
        dislikes: 0,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        replies: 0,
        time: date.getTime(),
      },
      refetchQueries: [{
        query: this.getCommentQuery,
        variables: {
          videoId: videoId
        }
      }],
    }).subscribe()
  }

  fetchComments(videoId: any): any {
    return this.apollo.watchQuery<any>({
      query: this.getCommentQuery,
      variables:{
        videoId: videoId
      }
    })
  }

  addReplyCount(commentId: any, videoId: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation addCount($commentId: ID!){
          addReplyCount(commentId: $commentId)
        }
      `,
      variables: {
        commentId: commentId
      },
      refetchQueries:[{
        query: this.getCommentQuery,
        variables:{
          videoId: videoId
        }
      }]
    }).subscribe()
  }
}