import { Injectable } from '@angular/core';
import { Posts } from '../model/post';
import { Apollo } from 'apollo-angular';
import gql from  'graphql-tag';

@Injectable()
export class PostService {

    constructor(private apollo: Apollo) {}
    
}