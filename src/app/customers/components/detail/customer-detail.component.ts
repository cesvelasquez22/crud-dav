import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/customer.interface';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  customerForm!: FormGroup;
  customerUidPath: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.buildForm();
    this.customerUidPath = this.route.snapshot.paramMap.get('id');
  }

  private buildForm() {
    this.customerForm = this.formBuilder.group({
      uid: [''],
      codigo: [null],
      nombre: [''],
      estadoCivil: [''],
      fechaNacimiento: [''],
      activo: [true],
    })
  }

  ngOnInit(): void {
    this.getCustomerInformation();
  }

  inputBirthDate(birthDate: any) {
    this.customerForm.get('fechaNacimiento')?.setValue(birthDate.value._d)
  }

  getCustomerInformation() {
    if (this.customerUidPath !== null) {
      this.customerService.getCustomerByUid(this.customerUidPath).subscribe(
        (customer) => {
          this.setInfoToForm(customer);
        }
      )
    }
  }

  setInfoToForm(customer: Customer) {
    this.customerForm.get('uid')?.setValue(customer.uid);
    this.customerForm.get('codigo')?.setValue(customer.codigo);
    this.customerForm.get('nombre')?.setValue(customer.nombre);
    this.customerForm.get('estadoCivil')?.setValue(customer.estadoCivil);
    this.customerForm.get('fechaNacimiento')?.setValue(customer.fechaNacimiento.toDate());
    this.customerForm.get('activo')?.setValue(customer.activo);
  }

  save() {
    const customerData = this.customerForm.value as Customer;
    if (this.customerUidPath !== null) {
      // EDITANDO
      this.customerService.updateCustomer(customerData).then(() => {
        console.log('Customer updated!');
      }).catch((err) => console.error(err));
    } else {
      // CREANDO
      this.customerService.createCustomer(customerData).then(() => {
        console.log('Customer created!');
        this.router.navigate(['/customers']);
      }).catch((err) => console.error(err))
    }
  }

  deleteCustomer() {
    this.customerService.deleteCustomer(this.customerUidPath as string).then(() => this.router.navigate(['/customers']));
  }

}
