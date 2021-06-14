export interface Customer {
    uid: string;
    codigo: number;
    nombre: string;
    estadoCivil?: CivilState;
    fechaNacimiento: firebase.default.firestore.Timestamp;
    activo: boolean;
}

export interface CivilState {
    uid: string;
    name: string;
}