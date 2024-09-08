import { Region } from "../Region/region";

export interface Provincia {
  id: number;
  nombre_provincia: string;
  capital_provincia: string;
  descripcion_provincia: string;
  poblacion_provincia: string;
  superficie_provincia: string;
  latitud_provincia: string;
  longitud_provincia: string;
  id_region: number;
  created_at: string | null;
  updated_at: string | null;
  region: Region;
}
