import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PlaylistModalInfo{

    private messageSource = new BehaviorSubject<boolean>(false);
    currentStatus = this.messageSource.asObservable();

    private uploadModal = new BehaviorSubject<boolean>(false)
    modalStatus = this.uploadModal.asObservable()

    changeStatus(newStatus: boolean){
        this.messageSource.next(newStatus)
    }

    changeModal(newStatus: boolean) {
        this.uploadModal.next(newStatus)
    }
}