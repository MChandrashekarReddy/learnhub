import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoiresManagementComponent } from './categoires-management.component';

describe('CategoiresManagementComponent', () => {
  let component: CategoiresManagementComponent;
  let fixture: ComponentFixture<CategoiresManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoiresManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoiresManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
