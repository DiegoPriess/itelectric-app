import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule } from '@angular/common';
import { IEnum } from '../../../core/models/Enum';
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/services/utils.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-material-create',
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
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.scss'
})
export class MaterialCreateComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];

  constructor(private fb: FormBuilder,
              private enumService: EnumService,
              private materialService: MaterialService,
              private utilsService: UtilsService,
              @Optional() private dialogRef?: MatDialogRef<MaterialCreateComponent>) {
    this.form = this.fb.group({
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
  }

  onSubmit() {
    this.materialService.add(this.form.value).subscribe({
      next: () => {
        if (this.dialogRef) this.dialogRef.close();
        this.utilsService.showSuccessMessage("Material adicionado com sucesso!")
      }
    });
  }

  closeDialog(): void {
    if (this.dialogRef) this.dialogRef.close();
  }
}
