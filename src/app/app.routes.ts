import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MaterialComponent } from './page/material/material.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'material', component: MaterialComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
