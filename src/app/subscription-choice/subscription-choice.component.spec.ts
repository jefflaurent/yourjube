import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionChoiceComponent } from './subscription-choice.component';

describe('SubscriptionChoiceComponent', () => {
  let component: SubscriptionChoiceComponent;
  let fixture: ComponentFixture<SubscriptionChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
