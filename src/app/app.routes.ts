import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MaterialCreateComponent } from './component/material/material-create/material-create.component';
import { MaterialEditComponent } from './component/material/material-edit/material-edit.component';
import { MaterialViewComponent } from './component/material/material-view/material-view.component';
import { WorkCreateComponent } from './component/work/work-create/work-create.component';
import { WorkEditComponent } from './component/work/work-edit/work-edit.component';
import { WorkViewComponent } from './component/work/work-view/work-view.component';
import { MaterialListComponent } from './component/material/material-list/material-list.component';
import { WorkListComponent } from './component/work/work-list/work-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/entrar', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'entrar', component: LoginComponent },
      { path: 'cadastrar', component: RegisterComponent }
    ]
  },
  { 
    path: 'menu', 
    component: DashboardComponent,
    children: [
      { path: 'materiais', component: MaterialListComponent },
      { path: 'materiais/criar', component: MaterialCreateComponent },
      { path: 'materiais/editar/:id', component: MaterialEditComponent },
      { path: 'materiais/visualizar/:id', component: MaterialViewComponent },
      { path: 'trabalhos', component: WorkListComponent },
      { path: 'trabalhos/criar', component: WorkCreateComponent },
      { path: 'trabalhos/editar/:id', component: WorkEditComponent },
      { path: 'trabalhos/visualizar/:id', component: WorkViewComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
