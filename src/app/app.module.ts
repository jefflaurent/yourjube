import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { SocialLoginModule,SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { AngularFireModule } from 'angularfire2';

import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { DropZoneDirective } from './drop-zone.directive';
import { UploadMenuComponent } from './upload-menu/upload-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoPageComponent } from './video-page/video-page.component';
import { MatVideoModule } from 'mat-video';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './main-page/main-page.component';
import { VideoPlayComponent } from './video-play/video-play.component';
import { VideoSideComponent } from './video-side/video-side.component';
import { CommentComponent } from './comment/comment.component';
import { NestedCommentComponent } from './nested-comment/nested-comment.component';
import { PlaylistDropdownComponent } from './playlist-dropdown/playlist-dropdown.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { PlaylistSideComponent } from './playlist-side/playlist-side.component';
import { PlaylistChoiceComponent } from './playlist-choice/playlist-choice.component';
import { PlaylistHeaderComponent } from './playlist-header/playlist-header.component';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import { TrendingPageComponent } from './trending-page/trending-page.component';
import { TrendingBottomComponent } from './trending-bottom/trending-bottom.component';
import { ChannelPageComponent } from './channel-page/channel-page.component';
import { ChannelHomeComponent } from './channel-home/channel-home.component';
import { ChannelPlaylistComponent } from './channel-playlist/channel-playlist.component';
import { ChannelVideosComponent } from './channel-videos/channel-videos.component';
import { ChannelPlaylistsComponent } from './channel-playlists/channel-playlists.component';
import { PremiumPageComponent } from './premium-page/premium-page.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';
import { SubscriptionChoiceComponent } from './subscription-choice/subscription-choice.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { PlaylistSearchComponent } from './playlist-search/playlist-search.component';
import { ChannelSearchComponent } from './channel-search/channel-search.component';
import { ChannelAboutComponent } from './channel-about/channel-about.component';
import { ChannelSettingsComponent } from './channel-settings/channel-settings.component';
import { PostService } from './data-service/post-service';
import { ChannelCommunityComponent } from './channel-community/channel-community.component';
import { CommunityPostComponent } from './community-post/community-post.component';
import { ChannelStudioComponent } from './channel-studio/channel-studio.component';
import { StudioVideoComponent } from './studio-video/studio-video.component';


import { PlaylistService } from './data-service/playlist-data';
import { PlaylistModalInfo } from './data-service/playlist-modal-service';
import { PlaylistVideoService } from './data-service/playlist-video-service';
import { VideoService } from './data-service/video-service';
import { CommentService } from './data-service/comment-service';
import { UserService } from './data-service/user-service';
import { SubscriptionService } from './data-service/subscription-service';
import { NotificationService } from './data-service/notification-service';
import { NotificationListComponent } from './notification-list/notification-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropZoneDirective,
    UploadMenuComponent,
    VideoPageComponent,
    MainPageComponent,
    VideoPlayComponent,
    VideoSideComponent,
    CommentComponent,
    NestedCommentComponent,
    PlaylistDropdownComponent,
    PlaylistPageComponent,
    PlaylistSideComponent,
    PlaylistChoiceComponent,
    PlaylistModalComponent,
    PlaylistHeaderComponent,
    TrendingPageComponent,
    TrendingBottomComponent,
    ChannelPageComponent,
    ChannelHomeComponent,
    ChannelPlaylistComponent,
    ChannelVideosComponent,
    ChannelPlaylistsComponent,
    PremiumPageComponent,
    CategoryPageComponent,
    SubscriptionPageComponent,
    SubscriptionChoiceComponent,
    SearchPageComponent,
    PlaylistSearchComponent,
    ChannelSearchComponent,
    ChannelAboutComponent,
    ChannelSettingsComponent,
    ChannelCommunityComponent,
    CommunityPostComponent,
    ChannelStudioComponent,
    StudioVideoComponent,
    NotificationListComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatVideoModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '671734057304-gmn2nk0ludqlrmtime6jlsva9jcoi261.apps.googleusercontent.com'
              ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    PlaylistService,
    PlaylistModalInfo,
    PlaylistVideoService,
    VideoService,
    CommentService,
    UserService,
    SubscriptionService,
    PostService,
    NotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

