import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BudgetCustomerCardListComponent } from './budget-customer-card-list.component';
import { BudgetService } from '../../../core/services/budget.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData, formatDate } from '@angular/common';

describe('BudgetCustomerCardListComponent', () => {
  let component: BudgetCustomerCardListComponent;
  let fixture: any;
  let mockBudgetService: any;

  beforeEach(async () => {
    registerLocaleData(localePt);

    mockBudgetService = {
      customerList: jest.fn().mockReturnValue(
        of({
          content: [
            {
              id: 1,
              deliveryForecast: '2024-12-31',
              customer: { name: 'Cliente A' },
              totalValue: 500.0,
              status: { label: 'Em andamento' },
              owner: { name: 'Eletricista A' },
              workList: [
                { name: 'Instalação Elétrica', laborPrice: 300, materialPrice: 200 }
              ]
            }
          ],
          totalElements: 1
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [
        BudgetCustomerCardListComponent,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatCardModule,
        MatExpansionModule,
        MatListModule,
        MatDividerModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: BudgetService, useValue: mockBudgetService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCustomerCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch budgets on initialization', () => {
    expect(mockBudgetService.customerList).toHaveBeenCalledWith(0, 10);
    expect(component.budgets.length).toBe(1);
    expect(component.totalElements).toBe(1);
  });

  it('should group budgets by electrician', () => {
    component.groupBudgetsByElectrician();
    expect(Object.keys(component.groupedBudgets)).toContain('Eletricista A');
    expect(component.groupedBudgets['Eletricista A'].length).toBe(1);
  });
});
