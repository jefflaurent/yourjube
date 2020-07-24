package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"Go_graphql/graph/generated"
	"Go_graphql/graph/model"
	"context"
	"errors"
)

func (r *mutationResolver) CreateChannel(ctx context.Context, input *model.NewChannel) (*model.Channel, error) {
	channel := model.Channel{
		Name:       input.Name,
		Email:      input.Email,
		PhotoURL:   input.PhotoURL,
		BannerURL:  input.BannerURL,
		Subscriber: input.Subscriber,
		IsPremium:  input.IsPremium,
	}

	_, err := r.DB.Model(&channel).Insert()

	if err != nil {
		return nil, errors.New("Something went wrong")
	}

	return &channel, nil
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
	}

	_, err := r.DB.Model(&video).Insert()

	if err != nil {
		return nil, err
	}

	return &video, nil
}

func (r *mutationResolver) UpdateVideo(ctx context.Context, videoID string, input *model.WatchVideo) (bool, error) {
	var video model.Video

	err := r.DB.Model(&video).Where("video_id = ?", videoID).Select()

	if err != nil {
		return false, err
	}

	video.Views = input.Views
	video.Likes = input.Likes
	video.Dislikes = input.Dislikes

	_, updateErr := r.DB.Model(&video).Where("video_id = ?", videoID).Update()

	if updateErr != nil {
		return false, updateErr
	}

	return true, nil
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

func (r *queryResolver) FindChannel(ctx context.Context, email string) ([]*model.Channel, error) {
	var channels []*model.Channel

	err := r.DB.Model(&channels).Where("email = ?", email).First()

	if err != nil {
		return nil, errors.New("Channel not found")
	}

	return channels, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
