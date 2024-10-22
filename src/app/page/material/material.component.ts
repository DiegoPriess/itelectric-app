import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EnumService } from '../../core/services/enum.service';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss'
})
export class MaterialComponent {
  form!: FormGroup;
  unitOfMeasureList: string[] = [];

  constructor(private fb: FormBuilder,
              private enumService: EnumService,) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      quantity: ['', Validators.required],
      unitOfMeasure: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: string[]) => {
      this.unitOfMeasureList = unitOfMeasureList;
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
