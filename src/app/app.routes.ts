import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MaterialCreateComponent } from './component/material/material-create/material-create.component';
import { WorkCreateComponent } from './component/work/work-create/work-create.component';
import { WorkEditComponent } from './component/work/work-edit/work-edit.component';
import { WorkViewComponent } from './component/work/work-view/work-view.component';
import { MaterialListComponent } from './component/material/material-list/material-list.component';
import { WorkListComponent } from './component/work/work-list/work-list.component';
import { BudgetListComponent } from './component/budget/budget-list/budget-list.component';
import { BudgetCreateComponent } from './component/budget/budget-create/budget-create.component';
import { BudgetViewComponent } from './component/budget/budget-view/budget-view.component';
import { BudgetEditComponent } from './component/budget/budget-edit/budget-edit.component';
import { BudgetCustomerCardListComponent } from './component/budget/budget-customer-card-list/budget-customer-card-list.component';
import { MaterialFormComponent } from './component/material/material-form/material-form.component';

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
      { path: 'materiais/editar/:id', component: MaterialFormComponent },
      { path: 'materiais/visualizar/:id', component: MaterialFormComponent },
      { path: 'trabalhos', component: WorkListComponent },
      { path: 'trabalhos/criar', component: WorkCreateComponent },
      { path: 'trabalhos/editar/:id', component: WorkEditComponent },
      { path: 'trabalhos/visualizar/:id', component: WorkViewComponent },
      { path: 'orcamentos', component: BudgetListComponent },
      { path: 'orcamentos/criar', component: BudgetCreateComponent },
      { path: 'orcamentos/editar/:id', component: BudgetEditComponent },
      { path: 'orcamentos/visualizar/:id', component: BudgetViewComponent },
      { path: 'orcamentos-cliente', component: BudgetCustomerCardListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
