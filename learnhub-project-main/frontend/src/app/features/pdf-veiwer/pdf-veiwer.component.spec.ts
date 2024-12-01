import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfVeiwerComponent } from './pdf-veiwer.component';

describe('PdfVeiwerComponent', () => {
  let component: PdfVeiwerComponent;
  let fixture: ComponentFixture<PdfVeiwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfVeiwerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfVeiwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
