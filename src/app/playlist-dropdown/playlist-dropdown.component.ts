import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Videos } from '../model/video'
import gql from 'graphql-tag'

@Component({
  selector: 'app-playlist-dropdown',
  templateUrl: './playlist-dropdown.component.html',
  styleUrls: ['./playlist-dropdown.component.scss']
})
export class PlaylistDropdownComponent implements OnInit {

  ngOnInit(){

  }
  
}
