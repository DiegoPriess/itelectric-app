import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IMaterial } from "../../../core/models/Material";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "../../../core/utils/utils.service";
import { MaterialService } from "../../../core/services/material.service";
import { EnumService } from "../../../core/services/enum.service";
import { IEnum } from "../../../core/interfaces/Enum";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss'
})
export class MaterialFormComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];
  materialId!: number;
  mode: 'editar' | 'visualizar' = 'visualizar';

  constructor(
    private readonly fb: FormBuilder,
    private readonly enumService: EnumService,
    private readonly materialService: MaterialService,
    private readonly utilsService: UtilsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      quantityUnitMeasure: ['', Validators.required],
      unitMeasure: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.detectMode();

    this.materialId = this.getIdFromUrl();
    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: IEnum[]) => {
      this.unitOfMeasureList = unitOfMeasureList;

      if (this.mode === 'editar' || this.mode === 'visualizar') {
        this.loadMaterialData();
      }

      if (this.mode === 'visualizar') {
        this.form.disable();
      }
    });
  }

  detectMode() {
    const url = this.router.url;
    if (url.includes('/editar')) {
      this.mode = 'editar';
    } else if (url.includes('/visualizar')) {
      this.mode = 'visualizar';
    }
  }

  get pageTitle(): string {
    return this.mode === 'editar' ? 'Editar Material' : 'Visualizar Material';
  }

  loadMaterialData() {
    this.materialService.get(this.materialId).subscribe({
      next: (material: IMaterial) => {
        this.form.patchValue({
          id: material.id,
          name: material.name,
          price: material.price,
          quantityUnitMeasure: material.quantityUnitMeasure,
          unitMeasure: this.unitOfMeasureList.find(u => u.name === material.unitMeasure.name)
        });
      }
    });
  }

  compareUnits(u1: any, u2: any): boolean {
    return u1 && u2 ? u1.name === u2.name : u1 === u2;
  }

  getIdFromUrl(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : 0;
  }

  back(): void {
    this.router.navigateByUrl("/menu/materiais");
  }

  onSubmit() {
    if (this.mode === 'editar') {
      this.materialService.edit(this.form.value).subscribe({
        next: () => {
          this.router.navigateByUrl("/menu/materiais");
          this.utilsService.showSuccessMessage("Material alterado com sucesso!");
        }
      });
    }
  }
}
