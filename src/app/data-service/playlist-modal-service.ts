import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PlaylistModalInfo{

    private messageSource = new BehaviorSubject<boolean>(false);
    currentStatus = this.messageSource.asObservable();

    changeStatus(newStatus: boolean){
        this.messageSource.next(newStatus)
    }

}