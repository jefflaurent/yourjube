import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedCommentComponent } from './nested-comment.component';

describe('NestedCommentComponent', () => {
  let component: NestedCommentComponent;
  let fixture: ComponentFixture<NestedCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
