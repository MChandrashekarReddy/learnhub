import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhonenumberComponent } from './update-phonenumber.component';

describe('UpdatePhonenumberComponent', () => {
  let component: UpdatePhonenumberComponent;
  let fixture: ComponentFixture<UpdatePhonenumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePhonenumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePhonenumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
