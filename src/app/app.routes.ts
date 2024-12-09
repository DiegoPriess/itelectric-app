import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MaterialListComponent } from './component/material/material-list/material-list.component';
import { WorkListComponent } from './component/work/work-list/work-list.component';
import { BudgetListComponent } from './component/budget/budget-list/budget-list.component';
import { BudgetCustomerCardListComponent } from './component/budget/budget-customer-card-list/budget-customer-card-list.component';

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
      { path: 'trabalhos', component: WorkListComponent },
      { path: 'orcamentos', component: BudgetListComponent },
      { path: 'orcamentos-cliente', component: BudgetCustomerCardListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
