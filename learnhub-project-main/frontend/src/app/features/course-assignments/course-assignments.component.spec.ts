import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAssignmentsComponent } from './course-assignments.component';

describe('CourseAssignmentsComponent', () => {
  let component: CourseAssignmentsComponent;
  let fixture: ComponentFixture<CourseAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseAssignmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
