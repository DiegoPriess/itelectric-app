import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BudgetCustomerCardListComponent } from './budget-customer-card-list.component';
import { BudgetService } from '../../../core/services/budget.service';
import { IBudgetResponse } from '../../../core/interfaces/budget/BudgetResponse';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IEnum } from '../../../core/interfaces/Enum';
import { IMaterial } from '../../../core/models/Material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetCustomerCardListComponent', () => {
  let component: BudgetCustomerCardListComponent;
  let fixture: ComponentFixture<BudgetCustomerCardListComponent>;
  let mockBudgetService: any;

  const mockMaterials: IMaterial[] = [
    {
      id: 1,
      name: 'Material A',
      price: 50,
      unitMeasure: { name: 'METER', label: 'Metros' } as IEnum,
      quantityUnitMeasure: 10
    },
    {
      id: 2,
      name: 'Material B',
      price: 100,
      unitMeasure: { name: 'KG', label: 'Quilogramas' } as IEnum,
      quantityUnitMeasure: 5
    }
  ];

  const mockBudgets: IBudgetResponse[] = [
    {
      id: 1,
      deliveryForecast: new Date(),
      customer: {
        name: 'Customer 1',
        id: 1,
        email: 'customer1@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      },
      totalValue: 1000,
      status: {
        label: 'Pending',
        name: 'pending'
      },
      workList: [
        {
          name: 'Work 1',
          price: 200,
          id: 101,
          materialList: mockMaterials
        }
      ],
      owner: {
        name: 'Electrician A',
        id: 10,
        email: 'electricianA@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      }
    },
    {
      id: 2,
      deliveryForecast: new Date(),
      customer: {
        name: 'Customer 2',
        id: 2,
        email: 'customer2@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      },
      totalValue: 1500,
      status: {
        label: 'APPROVED',
        name: 'Aprovado'
      },
      workList: [
        {
          name: 'Work 2',
          price: 300,
          id: 102,
          materialList: []
        }
      ],
      owner: {
        name: 'Electrician A',
        id: 10,
        email: 'electricianA@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      }
    },
    {
      id: 3,
      deliveryForecast: new Date(),
      customer: {
        name: 'Customer 3',
        id: 3,
        email: 'customer3@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      },
      totalValue: 2000,
      status: {
        label: 'DENIED',
        name: 'Negado'
      },
      workList: [
        {
          name: 'Work 3',
          price: 400,
          id: 103,
          materialList: mockMaterials
        }
      ],
      owner: {
        name: 'Electrician B',
        id: 11,
        email: 'electricianB@example.com',
        dateCreated: new Date(),
        dateUpdated: new Date()
      }
    }
  ];

  beforeEach(async () => {
    mockBudgetService = {
      customerList: jasmine.createSpy('customerList').and.returnValue(
        of({
          content: mockBudgets,
          totalElements: 3
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [
        BudgetCustomerCardListComponent,
        MatCardModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatPaginatorModule,
        HttpClientTestingModule
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
    expect(component.budgets.length).toBe(3);
    expect(component.totalElements).toBe(3);
  });

  it('should group budgets by electrician', () => {
    component.groupBudgetsByElectrician();
    expect(Object.keys(component.groupedBudgets).length).toBe(2);
    expect(component.groupedBudgets['Electrician A'].length).toBe(2);
    expect(component.groupedBudgets['Electrician B'].length).toBe(1);
  });

  it('should update pageIndex and pageSize on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 };
    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(mockBudgetService.customerList).toHaveBeenCalledWith(1, 5);
  });

  it('should display the correct budget details', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelectorAll('.budget-card').length).toBe(3);

    const firstCard = compiled.querySelector('.budget-card');
    expect(firstCard.querySelector('mat-card-title').textContent).toContain('Orçamento #1');
    expect(firstCard.querySelector('mat-card-subtitle').textContent).toContain('Previsão:');
    expect(firstCard.querySelector('p strong').textContent).toContain('Cliente:');
  });

  it('should handle empty budgets gracefully', () => {
    mockBudgetService.customerList.and.returnValue(of({ content: [], totalElements: 0 }));
    component.fetchBudgets();

    expect(component.budgets.length).toBe(0);
    expect(component.groupedBudgets).toEqual({});
  });
});
