import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSideComponent } from './playlist-side.component';

describe('PlaylistSideComponent', () => {
  let component: PlaylistSideComponent;
  let fixture: ComponentFixture<PlaylistSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
