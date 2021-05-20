import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Customer } from '../models/customer.interface';
import firebase from 'firebase/app';

@Injectable()
export class CustomersService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  getAllCustomers() {
    return this.afs.collection('clientes').snapshotChanges().pipe(
      map((snapshot) => {
        return snapshot.map((action) => {
          const data = action.payload.doc.data() as Customer;
          data.uid = action.payload.doc.id;
          return data;
        });
      })
    )
  }

  getCustomerByUid(uid: string) {
    return this.afs.collection('clientes').doc(uid).valueChanges().pipe(map((customer: any) => customer as Customer));
  }

  createCustomer(customer: Customer) {
    const docId = this.afs.createId();
    const timestampBirthDate = firebase.firestore.Timestamp.fromDate(customer.fechaNacimiento as any);
    customer.uid = docId;
    return this.afs.collection('clientes').doc(docId).set({
      uid: customer.uid,
      codigo: customer.codigo,
      nombre: customer.nombre,
      estadoCivil: customer.estadoCivil,
      fechaNacimiento: timestampBirthDate,
      activo: customer.activo,
    });
  }

  updateCustomer(customer: Customer) {
    const customerDocRef = this.afs.collection('clientes').doc(customer.uid);
    return customerDocRef.update(customer);
  }

  deleteCustomer(uid: string) {
    const customerDocRef = this.afs.collection('clientes').doc(uid);
    return customerDocRef.delete();
  }
}
