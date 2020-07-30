import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistChoiceComponent } from './playlist-choice.component';

describe('PlaylistChoiceComponent', () => {
  let component: PlaylistChoiceComponent;
  let fixture: ComponentFixture<PlaylistChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
