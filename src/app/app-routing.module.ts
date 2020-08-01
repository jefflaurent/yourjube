import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { VideoPlayComponent } from './video-play/video-play.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';

const routes: Routes = [
  {path:"", redirectTo:"/main-menu", pathMatch:'full'},
  {path:"main-menu", component: MainPageComponent },
  {path:"video/:id", component: VideoPlayComponent },
  {path:"playlist/:id", component: PlaylistPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
