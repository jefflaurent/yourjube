import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelStudioComponent } from './channel-studio.component';

describe('ChannelStudioComponent', () => {
  let component: ChannelStudioComponent;
  let fixture: ComponentFixture<ChannelStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelStudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
