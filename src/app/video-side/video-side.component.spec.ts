import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSideComponent } from './video-side.component';

describe('VideoSideComponent', () => {
  let component: VideoSideComponent;
  let fixture: ComponentFixture<VideoSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
