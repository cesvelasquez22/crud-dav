import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerDetailComponent } from './components/detail/customer-detail.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'create', component: CustomerDetailComponent },
  { path: ':id', component: CustomerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
