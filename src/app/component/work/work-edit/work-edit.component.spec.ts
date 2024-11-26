import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkEditComponent } from './work-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('WorkEditComponent', () => {
  let component: WorkEditComponent;
  let fixture: ComponentFixture<WorkEditComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WorkEditComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') {
                    return '123';
                  }
                  return null;
                },
              },
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkEditComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
