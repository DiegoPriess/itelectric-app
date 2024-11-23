import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkEditComponent } from './work-edit.component';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MaterialCardListComponent } from '../../material/material-card-list/material-card-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { IWork } from '../../../core/models/Work';
import { IMaterial } from '../../../core/models/Material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkEditComponent', () => {
  let component: WorkEditComponent;
  let fixture: ComponentFixture<WorkEditComponent>;
  let mockWorkService: any;
  let mockUtilsService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockWork: IWork = {
    id: 1,
    name: 'Sample Work',
    price: 500,
    materialList: [
      { id: 1, name: 'Material A', price: 100, quantityUnitMeasure: 5, unitMeasure: { name: 'KG', label: 'Quilograma' } },
      { id: 2, name: 'Material B', price: 200, quantityUnitMeasure: 10, unitMeasure: { name: 'KG', label: 'Quilograma' } }
    ]
  };

  beforeEach(async () => {
    mockWorkService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockWork)),
      edit: jasmine.createSpy('edit').and.returnValue(of({}))
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage')
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    mockActivatedRoute = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MaterialCardListComponent,
        WorkEditComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkService, useValue: mockWorkService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load work data on initialization', () => {
    component.ngOnInit();
    expect(mockWorkService.get).toHaveBeenCalledWith(1);
    expect(component.form.value.name).toBe(mockWork.name);
    expect(component.form.value.price).toBe(mockWork.price);
    expect(component.selectedMaterials).toEqual(mockWork.materialList);
  });

  it('should update selected materials on change', () => {
    const newMaterials: IMaterial[] = [
      { id: 3, name: 'Material C', price: 300, quantityUnitMeasure: 15, unitMeasure: { name: 'cm', label: 'Centimeter' } }
    ];
    component.onSelectedMaterialsChange(newMaterials);

    expect(component.selectedMaterials).toEqual(newMaterials);
    expect(component.selectedMaterialIds).toEqual([3]);
  });

  it('should navigate back on back button click', () => {
    component.back();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/trabalhos');
  });

  it('should submit updated work data', () => {
    component.form.patchValue({
      id: mockWork.id,
      name: 'Updated Work',
      price: 700
    });
    component.selectedMaterialIds = [1, 2];

    component.onSubmit();

    expect(mockWorkService.edit).toHaveBeenCalledWith(
      { id: mockWork.id, name: 'Updated Work', price: 700 },
      [1, 2]
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/trabalhos');
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Trabalho alterado com sucesso!');
  });

  it('should disable submit button for invalid form', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    component.form.patchValue({
      name: 'Valid Work',
      price: 800
    });
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });

  it('should render selected materials', () => {
    fixture.detectChanges();
    const materialCards = fixture.nativeElement.querySelectorAll('.selected-materials-box mat-card');
    expect(materialCards.length).toBe(2);
    expect(materialCards[0].textContent).toContain('Material A');
    expect(materialCards[1].textContent).toContain('Material B');
  });
});
