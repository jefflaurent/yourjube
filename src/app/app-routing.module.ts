import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { VideoPlayComponent } from './video-play/video-play.component';

const routes: Routes = [
  {path:"", redirectTo:"/main-menu", pathMatch:'full'},
  {path:"main-menu", component: MainPageComponent },
  {path:"video/:id", component: VideoPlayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
