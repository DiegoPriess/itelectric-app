import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkCardListComponent } from './work-card-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkCardListComponent', () => {
  let component: WorkCardListComponent;
  let fixture: ComponentFixture<WorkCardListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WorkCardListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCardListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});
