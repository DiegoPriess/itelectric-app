import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { IEnum } from '../../../core/models/Enum';
import { IMaterial } from '../../../core/models/Material';
import { MaterialCreateComponent } from '../material-create/material-create.component';
import { EnumService } from '../../../core/services/enum.service';

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [
    CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
    MatSelectModule,
    MatIcon
  ],
  templateUrl: './material-view.component.html',
  styleUrl: './material-view.component.scss'
})
export class MaterialViewComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];
  material!: IMaterial;

  constructor(private fb: FormBuilder,
              private enumService: EnumService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              @Optional() private dialogRef?: MatDialogRef<MaterialCreateComponent>) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      quantityUnitMeasure: ['', Validators.required],
      unitMeasure: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: IEnum[]) => {
      this.unitOfMeasureList = unitOfMeasureList;
    });

    this.form.patchValue(this.data.material);
  }

  closeDialog(): void {
    if (this.dialogRef) this.dialogRef.close();
  }
}
