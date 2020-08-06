import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingBottomComponent } from './trending-bottom.component';

describe('TrendingBottomComponent', () => {
  let component: TrendingBottomComponent;
  let fixture: ComponentFixture<TrendingBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
