import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CivilState, Customer } from '../../models/customer.interface';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customerForm!: FormGroup;
  customerUidPath: string | null;
  civilStates: CivilState[] = [];

  // UNSUBSCRIBE ALL
  private unsubscribe$ = new Subject<void>();

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
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      fechaNacimiento: [''],
      activo: [true],
    })
  }

  ngOnInit(): void {
    this.getCivilStates();
    this.getCustomerInformation();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  inputBirthDate(birthDate: any) {
    this.customerForm.get('fechaNacimiento')?.setValue(birthDate.value._d)
  }

  getCivilStates() {
    this.customerService.getCivilStates().pipe(takeUntil(this.unsubscribe$)).subscribe(states => {
      if (states && states.length > 0) {
        this.civilStates = states;
      }
    })
  }

  getCustomerInformation() {
    if (this.customerUidPath !== null) {
      this.customerService.getCustomerByUid(this.customerUidPath).pipe(takeUntil(this.unsubscribe$)).subscribe(
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
    this.customerForm.get('estadoCivil')?.setValue(customer.estadoCivil?.uid);
    this.customerForm.get('fechaNacimiento')?.setValue(customer.fechaNacimiento.toDate());
    this.customerForm.get('activo')?.setValue(customer.activo);
  }

  save() {
    const customerData = this.customerForm.value;
    const stateAssigned = this.civilStates.find((state) => state.uid === customerData.estadoCivil);
    customerData.estadoCivil = stateAssigned;
    if (this.customerUidPath !== null) {
      // EDITANDO
      this.customerService.updateCustomer(customerData).then(() => {
        console.log('Customer updated!');
        this.router.navigate(['/customers']);
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
