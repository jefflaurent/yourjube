import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBillingComponent } from './premium-billing.component';

describe('PremiumBillingComponent', () => {
  let component: PremiumBillingComponent;
  let fixture: ComponentFixture<PremiumBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
