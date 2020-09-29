import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollArchivedComponent } from './poll-archived.component';

describe('PollArchivedComponent', () => {
  let component: PollArchivedComponent;
  let fixture: ComponentFixture<PollArchivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollArchivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
