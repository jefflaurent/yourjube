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

  increaseCommentLike(commentId: any, videoId: any) : void {
    this.apollo.mutate({
      mutation: gql`
        mutation increaseCommentLike($commentId: ID!) {
          increaseCommentLike(commentId: $commentId)
        }
      `,
      variables: {
        commentId: commentId
      },
      refetchQueries:[{
        query: this.getCommentQuery,
        variables: {
          videoId: videoId
        }
      }]
    }).subscribe()
  }

  decreaseCommentLike(commentId: any, videoId: any) : void {
    this.apollo.mutate({
      mutation: gql`
        mutation decreaseCommentLike($commentId: ID!) {
          decreaseCommentLike(commentId: $commentId)
        }
      `,
      variables: {
        commentId: commentId
      },
      refetchQueries:[{
        query: this.getCommentQuery,
        variables: {
          videoId: videoId
        }
      }]
    }).subscribe()
  }
  
  increaseCommentDislike(commentId: any, videoId: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation increaseDislikeCount($commentId: ID!) {
          increaseCommentDislike(commentId: $commentId)
        }
      `,
      variables: {
        commentId: commentId
      },
      refetchQueries:[{
        query: this.getCommentQuery,
        variables: {
          videoId: videoId
        }
      }]
    }).subscribe()
  }

  decreaseCommentDislike(commentId: any, videoId: any) : void {
    this.apollo.mutate({
      mutation: gql`
        mutation decreaseCommentDislike($commentId: ID!) {
          decreaseCommentDislike(commentId: $commentId)
        }
      `,
      variables: {
        commentId: commentId
      },
      refetchQueries:[{
        query: this.getCommentQuery,
        variables: {
          videoId: videoId
        }
      }]
    }).subscribe()
  }

  registerCommentLike(commentId: any, channelId: any, channelEmail: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation registerCommentLike(
          $commentId: Int!,
          $channelId: Int!,
          $channelEmail: String!,
        ) {
          registerCommentLike(input:{
            commentId: $commentId,
            channelId: $channelId,
            channelEmail: $channelEmail,
          }) {
            commentLikeId,
            commentId,
            channelId,
            channelEmail,
          }
        }
      `,
      variables: {
        commentId: commentId,
        channelId: channelId,
        channelEmail: channelEmail,
      }
    }).subscribe()
  }

  registerCommentDislike(commentId: any, channelId: any, channelEmail: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation registerCommentDislike(
          $commentId: Int!,
          $channelId: Int!,
          $channelEmail: String!,
        ) {
          registerCommentDislike( input:{
            commentId: $commentId,
            channelId: $channelId,
            channelEmail: $channelEmail,
          }) {
            commentDislikeId,
            commentId,
            channelId,
            channelEmail,
          }
        }
      `,
      variables: {
        commentId: commentId,
        channelId: channelId,
        channelEmail: channelEmail,
      }
    }).subscribe()
  }

  removeCommentLike(commentId: any, channelEmail: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation removeCommentLike($commentId: Int!, $channelEmail: String!) {
          removeCommentLike(commentId: $commentId, channelEmail: $channelEmail)
        }
      `,
      variables: {
        commentId: commentId,
        channelEmail: channelEmail,
      }
    }).subscribe()
  }

  removeCommentDislike(commentId: any, channelEmail: any): void {
    this.apollo.mutate({
      mutation: gql`
        mutation removeCommentDislike($commentId: Int!, $channelEmail: String!) {
          removeCommentDislike(commentId: $commentId, channelEmail: $channelEmail)
        }
      `,
      variables: {
        commentId: commentId,
        channelEmail: channelEmail,
      }
    }).subscribe()
  }

  findCommentLike(commentId: any, channelEmail: any): any {
    return this.apollo.query({
      query: gql`
        query findCommentLike($channelEmail: String!, $commentId: Int!) {
          findCommentLike(channelEmail: $channelEmail, commentId: $commentId) {
            commentLikeId,
            commentId,
            channelId,
            channelEmail,
          }
        }
      `,
      variables: {
        channelEmail: channelEmail,
        commentId: commentId,
      }
    })
  }

  findCommentDislike(commentId: any, channelEmail: any): any {
    return this.apollo.query({
      query: gql`
        query findCommentDislike($channelEmail: String!, $commentId: Int!) {
          findCommentDislike(channelEmail: $channelEmail, commentId: $commentId) {
            commentDislikeId,
            commentId,
            channelId,
            channelEmail,
          }
        }
      `,
      variables: {
        channelEmail: channelEmail,
        commentId: commentId,
      }
    })
  }
}