import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCreateComponent } from './budget-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetCreateComponent', () => {
  let component: BudgetCreateComponent;
  let fixture: ComponentFixture<BudgetCreateComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [BudgetCreateComponent, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCreateComponent);
    component = fixture.componentInstance;
  });

  it('must create the component', () => {
    expect(component).toBeTruthy();
  });

  it('must init empty form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('deliveryForecast')?.value).toEqual('');
    expect(component.form.get('customerEmail')?.value).toBeNull();
  });
});
