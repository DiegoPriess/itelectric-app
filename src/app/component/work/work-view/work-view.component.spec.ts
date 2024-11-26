import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkViewComponent } from './work-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('WorkViewComponent', () => {
  let component: WorkViewComponent;
  let fixture: ComponentFixture<WorkViewComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WorkViewComponent, ReactiveFormsModule, HttpClientTestingModule],
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

    fixture = TestBed.createComponent(WorkViewComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});
