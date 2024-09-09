import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoReportComponent } from './empleado-report.component';

describe('EmpleadoReportComponent', () => {
  let component: EmpleadoReportComponent;
  let fixture: ComponentFixture<EmpleadoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
