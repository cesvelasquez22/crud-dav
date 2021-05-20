import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer } from '../../models/customer.interface';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];

  // Unsubscribe All
  private unsubscribe$ = new Subject<void>();
  constructor(
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCustomers() {
    this.customersService.getAllCustomers().pipe(takeUntil(this.unsubscribe$)).subscribe(customers => {
      if (customers && customers.length > 0) {
        this.customers = customers;
      }
    })
  }

  deleteCustomer(uid: string) {
    this.customersService.deleteCustomer(uid);
  }

  changeCustomerStatus(customer: Customer) {
    customer.activo = !customer.activo;
    this.customersService.updateCustomer(customer);
  }

}
