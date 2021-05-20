import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerDetailComponent } from './components/detail/customer-detail.component';
import { CustomersService } from './services/customers.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
  ],
  providers: [CustomersService],
})
export class CustomersModule { }
