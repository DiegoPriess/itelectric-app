import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCustomerCardListComponent } from './budget-customer-card-list.component';

describe('BudgetCustomerCardListComponent', () => {
  let component: BudgetCustomerCardListComponent;
  let fixture: ComponentFixture<BudgetCustomerCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCustomerCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCustomerCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
