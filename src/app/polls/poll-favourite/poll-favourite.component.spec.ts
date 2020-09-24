import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollFavouriteComponent } from './poll-favourite.component';

describe('PollFavouriteComponent', () => {
  let component: PollFavouriteComponent;
  let fixture: ComponentFixture<PollFavouriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollFavouriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
