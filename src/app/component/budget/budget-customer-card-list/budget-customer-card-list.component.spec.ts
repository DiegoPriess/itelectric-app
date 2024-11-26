import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCustomerCardListComponent } from './budget-customer-card-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetCustomerCardListComponent', () => {
  let component: BudgetCustomerCardListComponent;
  let fixture: ComponentFixture<BudgetCustomerCardListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [BudgetCustomerCardListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCustomerCardListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});
