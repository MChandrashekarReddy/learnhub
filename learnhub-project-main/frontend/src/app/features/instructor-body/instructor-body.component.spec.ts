import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorBodyComponent } from './instructor-body.component';

describe('InstructorBodyComponent', () => {
  let component: InstructorBodyComponent;
  let fixture: ComponentFixture<InstructorBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
