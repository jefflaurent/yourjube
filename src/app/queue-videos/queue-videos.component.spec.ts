import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueVideosComponent } from './queue-videos.component';

describe('QueueVideosComponent', () => {
  let component: QueueVideosComponent;
  let fixture: ComponentFixture<QueueVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
