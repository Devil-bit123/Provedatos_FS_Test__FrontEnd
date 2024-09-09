import { Provincia } from "../Provincia/provincia";

export interface Empleado {
  id?: number;
  nombres: string;
  apellidos: string;
  cedula: number;
  provincia: Provincia;
  fecha_nacimiento: string;
  email: string;
  observaciones?: any;
  fotografia?: any;
  fecha_ingreso: string;
  cargo: string;
  departamento: string;
  provincia_laboral: Provincia;
  sueldo: string;
  jornada_parcial: boolean;
  observaciones_laborales?: any;
  fot_nueva?:any;
}
