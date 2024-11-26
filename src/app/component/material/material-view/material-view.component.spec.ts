import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialViewComponent } from './material-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('MaterialViewComponent', () => {
  let component: MaterialViewComponent;
  let fixture: ComponentFixture<MaterialViewComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MaterialViewComponent, ReactiveFormsModule, HttpClientTestingModule],
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

    fixture = TestBed.createComponent(MaterialViewComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});
