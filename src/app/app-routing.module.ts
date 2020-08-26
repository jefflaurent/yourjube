import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { VideoPlayComponent } from './video-play/video-play.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { TrendingPageComponent } from './trending-page/trending-page.component';
import { ChannelPageComponent } from './channel-page/channel-page.component';
import { PremiumPageComponent } from './premium-page/premium-page.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';
import { SearchPageComponent } from './search-page/search-page.component';

const routes: Routes = [
  { path:"", redirectTo:"/main-menu", pathMatch:'full' },
  { path:"main-menu", component: MainPageComponent },
  { path:"trending", component: TrendingPageComponent },
  { path:"video/:id", component: VideoPlayComponent },
  { path:"video/playlist/:playlistid/:id", component: VideoPlayComponent },
  { path:"playlist/:id", component: PlaylistPageComponent },
  { path:"channel/:id", component: ChannelPageComponent },
  { path:"premium", component: PremiumPageComponent },
  { path:"category/:category", component: CategoryPageComponent },
  { path:"subscriptions", component: SubscriptionPageComponent },
  { path:"search/:query", component: SearchPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
