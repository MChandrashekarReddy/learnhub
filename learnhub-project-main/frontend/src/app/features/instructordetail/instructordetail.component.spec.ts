import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDeatilComponent } from './instructordetail.component';

describe('InstructorDeatilComponent', () => {
  let component: InstructorDeatilComponent;
  let fixture: ComponentFixture<InstructorDeatilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorDeatilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
