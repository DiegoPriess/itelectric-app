import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCreateComponent } from './material-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialCreateComponent', () => {
  let component: MaterialCreateComponent;
  let fixture: ComponentFixture<MaterialCreateComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MaterialCreateComponent, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCreateComponent);
    component = fixture.componentInstance;
  });

  it('must create the component', () => {
    expect(component).toBeTruthy();
  });

  it('must init empty form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')?.value).toEqual('');
    expect(component.form.get('price')?.value).toEqual('');
    expect(component.form.get('quantityUnitMeasure')?.value).toEqual('');
    expect(component.form.get('unitMeasure')?.value).toEqual('');
  });
});
