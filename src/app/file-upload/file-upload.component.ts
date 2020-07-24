import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  task: AngularFireUploadTask;

  percentage: Observable<number>;

  snapshot: Observable<any>;

  downloadURL: Observable<string>;

  isHovering: boolean;

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    
    const file = event.item(0)

    const path = `test/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file)

    const ref = this.storage.ref(path);
    // this.downloadURL = ref.getDownloadURL();
    
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
        });
      })
    ).subscribe();
  }

  // isActive(snapshot) {
  //   return snapshot.state == 'running' && snapshot.byteTransferred < snapshot.totalBytes
  // }
}

