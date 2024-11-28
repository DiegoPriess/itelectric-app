import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkCreateComponent } from './work-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkCreateComponent', () => {
  let component: WorkCreateComponent;
  let fixture: ComponentFixture<WorkCreateComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WorkCreateComponent, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCreateComponent);
    component = fixture.componentInstance;
  });

  it('must create the component', () => {
    expect(component).toBeTruthy();
  });

  it('must init empty form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')?.value).toEqual('');
    expect(component.form.get('laborPrice')?.value).toEqual('');
  });
});
