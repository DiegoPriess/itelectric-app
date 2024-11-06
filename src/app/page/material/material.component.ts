import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MaterialListComponent } from "../../component/material/material-list/material-list.component";

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    MatSidenavModule,
    MaterialListComponent,
],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss'
})
export class MaterialComponent {}
