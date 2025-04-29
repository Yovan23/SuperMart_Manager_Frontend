import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCashierComponent } from './dashboard-cashier.component';

describe('DashboardCashierComponent', () => {
  let component: DashboardCashierComponent;
  let fixture: ComponentFixture<DashboardCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCashierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
