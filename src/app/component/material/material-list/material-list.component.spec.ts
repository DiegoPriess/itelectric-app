import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialListComponent } from './material-list.component';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

class MockMaterialService {
  list() {
    return of({ content: [], totalElements: 0 });
  }
  get() {
    return of({});
  }
  delete() {
    return of({});
  }
}

class MockUtilsService {
  showSuccessMessage() {}
}

class MockBsModalService {
  show() {}
}

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialListComponent,
        MatPaginatorModule, 
        MatTableModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MaterialService, useClass: MockMaterialService },
        { provide: UtilsService, useClass: MockUtilsService },
        { provide: BsModalService, useClass: MockBsModalService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData on initialization', () => {
    const loadDataSpy = jest.spyOn(component, 'loadData');
    component.ngOnInit();
    expect(loadDataSpy).toHaveBeenCalled();
  });
});
