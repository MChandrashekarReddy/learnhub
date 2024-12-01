import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbodyComponent } from './adminbody.component';

describe('AdminbodyComponent', () => {
  let component: AdminbodyComponent;
  let fixture: ComponentFixture<AdminbodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminbodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminbodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
