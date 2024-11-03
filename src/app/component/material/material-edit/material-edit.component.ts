import { Component, Inject, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { IEnum } from '../../../core/models/Enum';
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/services/utils.service';
import { IMaterial } from '../../../core/models/Material';
import { MaterialCreateComponent } from '../material-create/material-create.component';

@Component({
  selector: 'app-material-edit',
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
  templateUrl: './material-edit.component.html',
  styleUrl: './material-edit.component.scss'
})
export class MaterialEditComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];
  material!: IMaterial;

  constructor(private fb: FormBuilder,
              private enumService: EnumService,
              private materialService: MaterialService,
              private utilsService: UtilsService,
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

  onSubmit() {
    this.materialService.edit(this.form.value).subscribe({
      next: () => {
        if (this.dialogRef) this.dialogRef.close();
        this.utilsService.showSuccessMessage("Material alterado com sucesso!")
      }
    });
  }

  closeDialog(): void {
    if (this.dialogRef) this.dialogRef.close();
  }
}
