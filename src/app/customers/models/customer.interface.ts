export interface Customer {
    uid: string;
    codigo: number;
    nombre: string;
    estadoCivil: string;
    fechaNacimiento: firebase.default.firestore.Timestamp;
    activo: boolean;
}