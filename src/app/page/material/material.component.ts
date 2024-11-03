import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EnumService } from '../../core/services/enum.service';
import { CommonModule } from '@angular/common';
import { IEnum } from '../../core/models/Enum';
import { MaterialListComponent } from "../../component/material/material-list/material-list.component";
import { MaterialCreateComponent } from '../../component/material/material-create/material-create.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MaterialListComponent,
    MaterialCreateComponent,
],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss'
})
export class MaterialComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];

  constructor(private fb: FormBuilder,
              private enumService: EnumService) {
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
}
