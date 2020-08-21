import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioVideoComponent } from './studio-video.component';

describe('StudioVideoComponent', () => {
  let component: StudioVideoComponent;
  let fixture: ComponentFixture<StudioVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
