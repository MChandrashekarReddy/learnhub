import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateemailComponent } from './updateemail.component';

describe('UpdateemailComponent', () => {
  let component: UpdateemailComponent;
  let fixture: ComponentFixture<UpdateemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateemailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
