package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"Go_graphql/graph/generated"
	"Go_graphql/graph/model"
	"context"
	"errors"
	"strings"
)

func (r *mutationResolver) CreateChannel(ctx context.Context, input *model.NewChannel) (*model.Channel, error) {
	channel := model.Channel{
		Name:               input.Name,
		Email:              input.Email,
		PhotoURL:           input.PhotoURL,
		BannerURL:          input.BannerURL,
		Subscriber:         input.Subscriber,
		IsPremium:          input.IsPremium,
		JoinDate:           input.JoinDate,
		JoinMonth:          input.JoinMonth,
		JoinYear:           input.JoinYear,
		ChannelDescription: input.ChannelDescription,
		IsMature:           input.IsMature,
		Twitter:            input.Twitter,
		Facebook:           input.Facebook,
		Instagram:          input.Instagram,
		ValidPremium:       input.ValidPremium,
	}

	_, err := r.DB.Model(&channel).Insert()

	if err != nil {
		return nil, err
	}

	return &channel, nil
}

func (r *mutationResolver) ChangeDescription(ctx context.Context, id string, channelDescription string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.ChannelDescription = channelDescription

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeTwitter(ctx context.Context, id string, twitter string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.Twitter = twitter

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeFacebook(ctx context.Context, id string, facebook string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.Facebook = facebook

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeInstagram(ctx context.Context, id string, instagram string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.Instagram = instagram

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeIcon(ctx context.Context, id string, photoURL string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.PhotoURL = photoURL

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeBanner(ctx context.Context, id string, bannerURL string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.BannerURL = bannerURL

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangePremium(ctx context.Context, id string, isPremium string) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.IsPremium = isPremium

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ValidPremium(ctx context.Context, id string, validPremium int) (bool, error) {
	var channel model.Channel

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	channel.ValidPremium = validPremium

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeVideoVisibility(ctx context.Context, videoID string, visibility string) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	video.Visibility = visibility

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeVideoDescription(ctx context.Context, videoID string, videoDesc string) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	video.VideoDesc = videoDesc

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeVideoTitle(ctx context.Context, videoID string, videoTitle string) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	video.VideoTitle = videoTitle

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangeVideoThumbnail(ctx context.Context, videoID string, videoThumbnail string) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	video.VideoThumbnail = videoThumbnail

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DeleteVideo(ctx context.Context, videoID string) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&video).Where("video_id = ?", videoID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) CreateVideo(ctx context.Context, input *model.NewVideo) (*model.Video, error) {
	video := model.Video{
		VideoTitle:      input.VideoTitle,
		VideoDesc:       input.VideoDesc,
		VideoURL:        input.VideoURL,
		VideoThumbnail:  input.VideoThumbnail,
		UploadDay:       input.UploadDay,
		UploadMonth:     input.UploadMonth,
		UploadYear:      input.UploadYear,
		Views:           input.Views,
		Likes:           input.Likes,
		Dislikes:        input.Dislikes,
		Visibility:      input.Visibility,
		Viewer:          input.Viewer,
		Category:        input.Category,
		ChannelName:     input.ChannelName,
		ChannelPhotoURL: input.ChannelPhotoURL,
		ChannelEmail:    input.ChannelEmail,
		Time:            input.Time,
	}

	_, err := r.DB.Model(&video).Insert()

	if err != nil {
		return nil, err
	}

	return &video, nil
}

func (r *mutationResolver) WatchVideo(ctx context.Context, videoID string) (bool, error) {
	var video model.Video
	var temp int

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	temp = video.Views
	temp++

	video.Views = temp

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) LikeVideo(ctx context.Context, videoID string) (bool, error) {
	var video model.Video
	var temp int

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	temp = video.Likes
	temp++

	video.Likes = temp

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DislikeVideo(ctx context.Context, videoID string) (bool, error) {
	var video model.Video
	var temp int

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	temp = video.Dislikes
	temp++

	video.Dislikes = temp

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) AddLike(ctx context.Context, input *model.NewLike) (*model.Like, error) {
	like := model.Like{
		ChannelID:      input.ChannelID,
		ChannelEmail:   input.ChannelEmail,
		VideoID:        input.VideoID,
		VideoThumbnail: input.VideoThumbnail,
		VideoURL:       input.VideoURL,
	}

	_, err := r.DB.Model(&like).Insert()

	if err != nil {
		return nil, err
	}

	return &like, nil
}

func (r *mutationResolver) AddDislike(ctx context.Context, input *model.NewDislike) (*model.Dislike, error) {
	dislike := model.Dislike{
		ChannelID:      input.ChannelID,
		ChannelEmail:   input.ChannelEmail,
		VideoID:        input.VideoID,
		VideoThumbnail: input.VideoThumbnail,
		VideoURL:       input.VideoURL,
	}

	_, err := r.DB.Model(&dislike).Insert()

	if err != nil {
		return nil, err
	}

	return &dislike, nil
}

func (r *mutationResolver) RemoveLike(ctx context.Context, channelID int, videoID int) (bool, error) {
	var likes model.Like

	err := r.DB.Model(&likes).Where("video_id = ? AND channel_id = ?", videoID, channelID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&likes).Where("video_id = ? AND channel_id = ?", videoID, channelID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) RemoveDislike(ctx context.Context, channelID int, videoID int) (bool, error) {
	var dislikes model.Dislike

	err := r.DB.Model(&dislikes).Where("video_id = ? AND channel_id = ?", videoID, channelID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&dislikes).Where("video_id = ? AND channel_id = ?", videoID, channelID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseLike(ctx context.Context, videoID string) (bool, error) {
	var video model.Video
	var temp int

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	temp = video.Likes
	temp--
	if temp < 0 {
		temp = 0
	}

	video.Likes = temp

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseDislike(ctx context.Context, videoID string) (bool, error) {
	var video model.Video
	var temp int

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	temp = video.Dislikes
	temp--
	if temp < 0 {
		temp = 0
	}

	video.Dislikes = temp

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) AddComment(ctx context.Context, input *model.NewComment) (*model.Comment, error) {
	comment := model.Comment{
		VideoID:         input.VideoID,
		ChannelID:       input.ChannelID,
		ChannelName:     input.ChannelName,
		ChannelEmail:    input.ChannelEmail,
		ChannelPhotoURL: input.ChannelPhotoURL,
		Content:         input.Content,
		ReplyTo:         input.ReplyTo,
		Likes:           input.Likes,
		Dislikes:        input.Dislikes,
		Day:             input.Day,
		Month:           input.Month,
		Year:            input.Year,
		Replies:         input.Replies,
		Time:            input.Time,
	}

	_, err := r.DB.Model(&comment).Insert()

	if err != nil {
		return nil, err
	}

	return &comment, nil
}

func (r *mutationResolver) AddReplyCount(ctx context.Context, commentID string) (bool, error) {
	var comment model.Comment
	var temp int

	err := r.DB.Model(&comment).Where("comment_id = ?", commentID).Select()

	if err != nil {
		return false, err
	}

	temp = comment.Replies
	temp++

	comment.Replies = temp

	_, updateErr := r.DB.Model(&comment).Where("comment_id = ?", commentID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) IncreaseCommentLike(ctx context.Context, commentID string) (bool, error) {
	var comment model.Comment
	var temp int

	err := r.DB.Model(&comment).Where("comment_id = ?", commentID).Select()

	if err != nil {
		return false, err
	}

	temp = comment.Likes
	temp++

	comment.Likes = temp

	_, updateErr := r.DB.Model(&comment).Where("comment_id = ?", commentID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseCommentLike(ctx context.Context, commentID string) (bool, error) {
	var comment model.Comment
	var temp int

	err := r.DB.Model(&comment).Where("comment_id = ?", commentID).Select()

	if err != nil {
		return false, err
	}

	temp = comment.Likes
	temp--

	if temp < 0 {
		temp = 0
	}

	comment.Likes = temp

	_, updateErr := r.DB.Model(&comment).Where("comment_id = ?", commentID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) IncreaseCommentDislike(ctx context.Context, commentID string) (bool, error) {
	var comment model.Comment
	var temp int

	err := r.DB.Model(&comment).Where("comment_id = ?", commentID).Select()

	if err != nil {
		return false, err
	}

	temp = comment.Dislikes
	temp++

	comment.Dislikes = temp

	_, updateErr := r.DB.Model(&comment).Where("comment_id = ?", commentID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseCommentDislike(ctx context.Context, commentID string) (bool, error) {
	var comment model.Comment
	var temp int

	err := r.DB.Model(&comment).Where("comment_id = ?", commentID).Select()

	if err != nil {
		return false, err
	}

	temp = comment.Dislikes
	temp--

	if temp < 0 {
		temp = 0
	}

	comment.Dislikes = temp

	_, updateErr := r.DB.Model(&comment).Where("comment_id = ?", commentID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) RegisterCommentLike(ctx context.Context, input *model.NewCommentLike) (*model.CommentLike, error) {
	commentLike := model.CommentLike{
		CommentID:    input.CommentID,
		ChannelID:    input.ChannelID,
		ChannelEmail: input.ChannelEmail,
	}

	_, err := r.DB.Model(&commentLike).Insert()

	if err != nil {
		return nil, err
	}

	return &commentLike, nil
}

func (r *mutationResolver) RegisterCommentDislike(ctx context.Context, input *model.NewCommentDislike) (*model.CommentDislike, error) {
	commentDislike := model.CommentDislike{
		CommentID:    input.CommentID,
		ChannelID:    input.ChannelID,
		ChannelEmail: input.ChannelEmail,
	}

	_, err := r.DB.Model(&commentDislike).Insert()

	if err != nil {
		return nil, err
	}

	return &commentDislike, nil
}

func (r *mutationResolver) RemoveCommentLike(ctx context.Context, commentID int, channelEmail string) (bool, error) {
	var commentLike model.CommentLike

	err := r.DB.Model(&commentLike).Where("comment_id = ? AND channel_email = ?", commentID, channelEmail).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&commentLike).Where("comment_id = ? AND channel_email = ?", commentID, channelEmail).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) RemoveCommentDislike(ctx context.Context, commentID int, channelEmail string) (bool, error) {
	var commentDislike model.CommentDislike

	err := r.DB.Model(&commentDislike).Where("comment_id = ? AND channel_email = ?", commentID, channelEmail).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&commentDislike).Where("comment_id = ? AND channel_email = ?", commentID, channelEmail).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) CreatePlaylist(ctx context.Context, input *model.NewPlaylist) (*model.Playlist, error) {
	playlist := model.Playlist{
		PlaylistName:        input.PlaylistName,
		PlaylistThumbnail:   input.PlaylistThumbnail,
		PlaylistDescription: input.PlaylistDescription,
		ChannelEmail:        input.ChannelEmail,
		LastDate:            input.LastDate,
		LastMonth:           input.LastMonth,
		LastYear:            input.LastYear,
		VideoCount:          input.VideoCount,
		Views:               input.Views,
		Visibility:          input.Visibility,
	}

	_, err := r.DB.Model(&playlist).Insert()

	if err != nil {
		return nil, err
	}

	return &playlist, nil
}

func (r *mutationResolver) AddPlaylist(ctx context.Context, input *model.NewPlaylistVideo) (*model.PlaylistVideo, error) {
	playlistVideo := model.PlaylistVideo{
		PlaylistID:     input.PlaylistID,
		VideoID:        input.VideoID,
		VideoName:      input.VideoName,
		VideoThumbnail: input.VideoThumbnail,
		VideoURL:       input.VideoURL,
		ChannelName:    input.ChannelName,
		ChannelEmail:   input.ChannelEmail,
		Time:           input.Time,
		Place:          input.Place,
	}

	_, err := r.DB.Model(&playlistVideo).Insert()

	if err != nil {
		return nil, err
	}

	return &playlistVideo, nil
}

func (r *mutationResolver) RemovePlaylistVideo(ctx context.Context, playlistID int, videoID int) (bool, error) {
	var playlistVideo model.PlaylistVideo

	err := r.DB.Model(&playlistVideo).Where("video_id = ? AND playlist_id = ?", videoID, playlistID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&playlistVideo).Where("video_id = ? AND playlist_id = ?", videoID, playlistID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) ChangePlaylistName(ctx context.Context, playlistID string, playlistName string) (bool, error) {
	var playlist model.Playlist

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	playlist.PlaylistName = playlistName

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangePlaylistDesc(ctx context.Context, playlistID string, playlistDescription string) (bool, error) {
	var playlist model.Playlist

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	playlist.PlaylistDescription = playlistDescription

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ChangePlaylistVisibility(ctx context.Context, playlistID string, visibility string) (bool, error) {
	var playlist model.Playlist

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	playlist.Visibility = visibility

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) UpdatePlaylistUpdate(ctx context.Context, playlistID string, lastDate int, lastMonth int, lastYear int) (bool, error) {
	var playlist model.Playlist

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	playlist.LastDate = lastDate
	playlist.LastMonth = lastMonth
	playlist.LastYear = lastYear

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) AddVideoCount(ctx context.Context, playlistID string) (bool, error) {
	var playlist model.Playlist
	var temp int

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	temp = playlist.VideoCount
	temp++

	playlist.VideoCount = temp

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseVideoCount(ctx context.Context, playlistID string) (bool, error) {
	var playlist model.Playlist
	var temp int

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	temp = playlist.VideoCount
	temp--

	if temp < 0 {
		temp = 0
	}

	playlist.VideoCount = temp

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) ClearPlaylist(ctx context.Context, playlistID int) (bool, error) {
	var playlistVideos []*model.PlaylistVideo

	err := r.DB.Model(&playlistVideos).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&playlistVideos).Where("playlist_id = ?", playlistID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) UpdateThumbnail(ctx context.Context, playlistID int, playlistThumbnail string) (bool, error) {
	var playlist model.Playlist

	err := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Select()

	if err != nil {
		return false, err
	}

	playlist.PlaylistThumbnail = playlistThumbnail

	_, updateErr := r.DB.Model(&playlist).Where("playlist_id = ?", playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) UpdatePlaylistPlace(ctx context.Context, playlistID int, videoID int, place int) (bool, error) {
	var playlistVideos model.PlaylistVideo

	err := r.DB.Model(&playlistVideos).Where("video_id = ? AND playlist_id = ?", videoID, playlistID).Select()

	if err != nil {
		return false, err
	}

	playlistVideos.Place = place

	_, updateErr := r.DB.Model(&playlistVideos).Where("video_id = ? AND playlist_id = ?", videoID, playlistID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) AddSubscription(ctx context.Context, input *model.NewSubscription) (*model.ChannelSubscription, error) {
	channelSubscription := model.ChannelSubscription{
		ClientEmail:     input.ClientEmail,
		ChannelID:       input.ChannelID,
		ChannelName:     input.ChannelName,
		ChannelEmail:    input.ChannelEmail,
		ChannelPhotoURL: input.ChannelPhotoURL,
	}

	_, err := r.DB.Model(&channelSubscription).Insert()

	if err != nil {
		return nil, err
	}

	return &channelSubscription, nil
}

func (r *mutationResolver) RemoveSubscription(ctx context.Context, clientEmail string, channelEmail string) (bool, error) {
	var channelSubscription model.ChannelSubscription

	err := r.DB.Model(&channelSubscription).Where("client_email = ? AND channel_email = ?", clientEmail, channelEmail).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&channelSubscription).Where("client_email = ? AND channel_email = ?", clientEmail, channelEmail).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) IncreaseSubscriber(ctx context.Context, id string) (bool, error) {
	var channel model.Channel
	var temp int

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = channel.Subscriber
	temp++

	channel.Subscriber = temp

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreaseSubscriber(ctx context.Context, id string) (bool, error) {
	var channel model.Channel
	var temp int

	err := r.DB.Model(&channel).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = channel.Subscriber
	temp--
	if temp < 0 {
		temp = 0
	}

	channel.Subscriber = temp

	_, updateErr := r.DB.Model(&channel).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) AddPost(ctx context.Context, input *model.NewPost) (*model.Post, error) {
	post := model.Post{
		ChannelID: input.ChannelID,
		Content:   input.Content,
		PhotoURL:  input.PhotoURL,
		Likes:     input.Likes,
		Dislikes:  input.Dislikes,
		Time:      input.Time,
	}

	_, err := r.DB.Model(&post).Insert()

	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (r *mutationResolver) IncreasePostLike(ctx context.Context, id string) (bool, error) {
	var post model.Post
	var temp int

	err := r.DB.Model(&post).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = post.Likes
	temp++

	post.Likes = temp

	_, updateErr := r.DB.Model(&post).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreasePostLike(ctx context.Context, id string) (bool, error) {
	var post model.Post
	var temp int

	err := r.DB.Model(&post).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = post.Likes
	temp--

	if temp < 0 {
		temp = 0
	}

	post.Likes = temp

	_, updateErr := r.DB.Model(&post).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) IncreasePostDislike(ctx context.Context, id string) (bool, error) {
	var post model.Post
	var temp int

	err := r.DB.Model(&post).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = post.Dislikes
	temp++

	post.Dislikes = temp

	_, updateErr := r.DB.Model(&post).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) DecreasePostDislike(ctx context.Context, id string) (bool, error) {
	var post model.Post
	var temp int

	err := r.DB.Model(&post).Where("id = ?", id).Select()

	if err != nil {
		return false, err
	}

	temp = post.Dislikes
	temp--

	if temp < 0 {
		temp = 0
	}

	post.Dislikes = temp

	_, updateErr := r.DB.Model(&post).Where("id = ?", id).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
}

func (r *mutationResolver) RegisterPostLike(ctx context.Context, input *model.NewPostLike) (bool, error) {
	postLike := model.PostLike{
		ChannelID: input.ChannelID,
		PostID:    input.PostID,
	}

	_, err := r.DB.Model(&postLike).Insert()

	if err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) RemovePostLike(ctx context.Context, postID int, channelID int) (bool, error) {
	var postLike model.PostLike

	err := r.DB.Model(&postLike).Where("post_id = ? AND channel_id = ?", postID, channelID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&postLike).Where("post_id = ? AND channel_id = ?", postID, channelID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) RegisterPostDislike(ctx context.Context, input *model.NewPostDislike) (bool, error) {
	postDislike := model.PostDislike{
		ChannelID: input.ChannelID,
		PostID:    input.PostID,
	}

	_, err := r.DB.Model(&postDislike).Insert()

	if err != nil {
		return false, err
	}

	return true, nil
}

func (r *mutationResolver) RemovePostDislike(ctx context.Context, postID int, channelID int) (bool, error) {
	var postDislike model.PostDislike

	err := r.DB.Model(&postDislike).Where("post_id = ? AND channel_id = ?", postID, channelID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&postDislike).Where("post_id = ? AND channel_id = ?", postID, channelID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) AddBell(ctx context.Context, input *model.NewBell) (*model.Bell, error) {
	bell := model.Bell{
		ClientID:  input.ClientID,
		ChannelID: input.ChannelID,
	}

	_, err := r.DB.Model(&bell).Insert()

	if err != nil {
		return nil, err
	}

	return &bell, nil
}

func (r *mutationResolver) DeleteBell(ctx context.Context, clientID int, channelID int) (bool, error) {
	var bell model.Bell

	err := r.DB.Model(&bell).Where("client_id = ? AND channel_id = ?", clientID, channelID).Select()

	if err != nil {
		return false, err
	}

	_, deleteErr := r.DB.Model(&bell).Where("client_id = ? AND channel_id = ?", clientID, channelID).Delete()

	if deleteErr != nil {
		return false, deleteErr
	}

	return true, nil
}

func (r *mutationResolver) AddNotification(ctx context.Context, input *model.NewNotification) (*model.Notification, error) {
	notification := model.Notification{
		ChannelID: input.ChannelID,
		Route:     input.Route,
		PhotoURL:  input.PhotoURL,
		Content:   input.Content,
		Type:      input.Type,
		Time:      input.Time,
	}

	_, err := r.DB.Model(&notification).Insert()

	if err != nil {
		return nil, err
	}

	return &notification, nil
}

func (r *queryResolver) Notifications(ctx context.Context) ([]*model.Notification, error) {
	var notifications []*model.Notification

	err := r.DB.Model(&notifications).Select()

	if err != nil {
		return nil, err
	}

	return notifications, nil
}

func (r *queryResolver) Bells(ctx context.Context) ([]*model.Bell, error) {
	var bells []*model.Bell

	err := r.DB.Model(&bells).Select()

	if err != nil {
		return nil, err
	}

	return bells, nil
}

func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	var posts []*model.Post

	err := r.DB.Model(&posts).Select()

	if err != nil {
		return nil, err
	}

	return posts, nil
}

func (r *queryResolver) PostLikes(ctx context.Context) ([]*model.PostLike, error) {
	var postLikes []*model.PostLike

	err := r.DB.Model(&postLikes).Select()

	if err != nil {
		return nil, err
	}

	return postLikes, nil
}

func (r *queryResolver) PostDislikes(ctx context.Context) ([]*model.PostDislike, error) {
	var postDislikes []*model.PostDislike

	err := r.DB.Model(&postDislikes).Select()

	if err != nil {
		return nil, err
	}

	return postDislikes, nil
}

func (r *queryResolver) Subscriptions(ctx context.Context) ([]*model.ChannelSubscription, error) {
	var subscriptions []*model.ChannelSubscription

	err := r.DB.Model(&subscriptions).Select()

	if err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func (r *queryResolver) Channels(ctx context.Context) ([]*model.Channel, error) {
	var channels []*model.Channel

	err := r.DB.Model(&channels).Select()

	if err != nil {
		return nil, errors.New("Channel not found")
	}

	return channels, nil
}

func (r *queryResolver) Videos(ctx context.Context) ([]*model.Video, error) {
	var videos []*model.Video

	err := r.DB.Model(&videos).Select()

	if err != nil {
		return nil, errors.New("Videos not found")
	}

	return videos, nil
}

func (r *queryResolver) PublicVideos(ctx context.Context) ([]*model.Video, error) {
	var videos []*model.Video
	vis := "public"

	err := r.DB.Model(&videos).Where("visibility = ?", vis).Select()

	if err != nil {
		return nil, errors.New("Public videos not found")
	}

	return videos, nil
}

func (r *queryResolver) Likes(ctx context.Context) ([]*model.Like, error) {
	var likes []*model.Like

	err := r.DB.Model(&likes).Select()

	if err != nil {
		return nil, errors.New("Likes not found")
	}

	return likes, nil
}

func (r *queryResolver) Comments(ctx context.Context, videoID int) ([]*model.Comment, error) {
	var comments []*model.Comment

	err := r.DB.Model(&comments).Where("video_id = ?", videoID).Select()

	if err != nil {
		return nil, err
	}

	return comments, nil
}

func (r *queryResolver) AllPlaylists(ctx context.Context) ([]*model.Playlist, error) {
	var playlists []*model.Playlist

	err := r.DB.Model(&playlists).Select()

	if err != nil {
		return nil, err
	}

	return playlists, nil
}

func (r *queryResolver) Playlists(ctx context.Context, channelEmail string) ([]*model.Playlist, error) {
	var playlists []*model.Playlist

	err := r.DB.Model(&playlists).Where("channel_email = ?", channelEmail).Select()

	if err != nil {
		return nil, err
	}

	return playlists, nil
}

func (r *queryResolver) PlaylistVideos(ctx context.Context, channelEmail string) ([]*model.PlaylistVideo, error) {
	var playlistVideos []*model.PlaylistVideo

	err := r.DB.Model(&playlistVideos).Where("channel_email = ?", channelEmail).Select()

	if err != nil {
		return nil, err
	}

	return playlistVideos, nil
}

func (r *queryResolver) FindVideo(ctx context.Context, videoID string) ([]*model.Video, error) {
	var video []*model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return nil, err
	}

	return video, nil
}

func (r *queryResolver) FindLike(ctx context.Context, email string, videoID int) ([]*model.Like, error) {
	var likes []*model.Like

	err := r.DB.Model(&likes).Where("video_id = ? AND channel_email = ?", videoID, email).Select()

	if err != nil {
		return nil, err
	}

	return likes, nil
}

func (r *queryResolver) FindDislike(ctx context.Context, email string, videoID int) ([]*model.Dislike, error) {
	var dislikes []*model.Dislike

	err := r.DB.Model(&dislikes).Where("channel_email = ? AND video_id = ?", email, videoID).Select()

	if err != nil {
		return nil, errors.New("Dislike not found")
	}

	return dislikes, nil
}

func (r *queryResolver) FindChannel(ctx context.Context, email string) ([]*model.Channel, error) {
	var channels []*model.Channel

	err := r.DB.Model(&channels).Where("email = ?", email).First()

	if err != nil {
		return nil, errors.New("Channel not found")
	}

	return channels, nil
}

func (r *queryResolver) FindReply(ctx context.Context, replyTo int) ([]*model.Comment, error) {
	var replies []*model.Comment

	err := r.DB.Model(&replies).Where("reply_to = ?", replyTo).Select()

	if err != nil {
		return nil, err
	}

	return replies, nil
}

func (r *queryResolver) FindCommentLike(ctx context.Context, channelEmail string, commentID int) ([]*model.CommentLike, error) {
	var commentLike []*model.CommentLike

	err := r.DB.Model(&commentLike).Where("channel_email =  ? AND comment_id = ?", channelEmail, commentID).Select()

	if err != nil {
		return nil, err
	}

	return commentLike, nil
}

func (r *queryResolver) FindCommentDislike(ctx context.Context, channelEmail string, commentID int) ([]*model.CommentDislike, error) {
	var commentDislike []*model.CommentDislike

	err := r.DB.Model(&commentDislike).Where("channel_email =  ? AND comment_id = ?", channelEmail, commentID).Select()

	if err != nil {
		return nil, err
	}

	return commentDislike, nil
}

func (r *queryResolver) FindVideoPlaylist(ctx context.Context, playlistID int, videoID int) ([]*model.PlaylistVideo, error) {
	var playlistVideo []*model.PlaylistVideo

	err := r.DB.Model(&playlistVideo).Where("playlist_id = ? AND video_id = ?", playlistID, videoID).Select()

	if err != nil {
		return nil, err
	}

	return playlistVideo, nil
}

func (r *queryResolver) SearchVideo(ctx context.Context, videoTitle string) ([]*model.Video, error) {
	var videos []*model.Video

	var newTitle = "%" + videoTitle + "%"

	newTitle = strings.ToLower(newTitle)

	err := r.DB.Model(&videos).Where("LOWER(video_title) LIKE ?", newTitle).Select()

	if err != nil {
		return nil, err
	}

	return videos, nil
}

func (r *queryResolver) SearchChannel(ctx context.Context, channelName string) ([]*model.Channel, error) {
	var channels []*model.Channel

	var newTitle = "%" + channelName + "%"

	newTitle = strings.ToLower(newTitle)

	err := r.DB.Model(&channels).Where("LOWER(name) LIKE ?", newTitle).Select()

	if err != nil {
		return nil, err
	}

	return channels, nil
}

func (r *queryResolver) SearchPlaylist(ctx context.Context, playlistName string) ([]*model.Playlist, error) {
	var playlists []*model.Playlist

	var newTitle = "%" + playlistName + "%"

	newTitle = strings.ToLower(newTitle)

	err := r.DB.Model(&playlists).Where("LOWER(playlist_name) LIKE ?", newTitle).Select()

	if err != nil {
		return nil, err
	}

	return playlists, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
