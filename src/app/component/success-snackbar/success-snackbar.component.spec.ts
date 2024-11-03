import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessSnackbarComponent } from './success-snackbar.component';

describe('ErrorSnackbarComponent', () => {
  let component: SuccessSnackbarComponent;
  let fixture: ComponentFixture<SuccessSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
