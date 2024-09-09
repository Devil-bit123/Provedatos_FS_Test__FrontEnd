import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../../interfaces/Empleado/empleado';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  GetEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}empleados`);
  }

  PostEmpleado(empleado: FormData): Observable<HttpEvent<Empleado>> {
    const headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data' // No se requiere especificar en los headers
    });
    return this.http.post<Empleado>(`${this.baseUrl}empleados`, empleado, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  PutEmpleado(id: number, empleado: FormData): Observable<HttpEvent<Empleado>> {
    const headers = new HttpHeaders({});
    return this.http.post<Empleado>(
      `${this.baseUrl}empleados/edit/${id}`,
      empleado,
      {
        headers,
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  DeleteEmpleado(idEmploye: number): Observable<Empleado> {
    return this.http.delete<Empleado>(`${this.baseUrl}empleados/${idEmploye}`);
  }

  downloadReport(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream', // Para descargar el archivo como binario
    });

    return this.http.get(`${this.baseUrl}empleados/export/`, { headers, responseType: 'blob' });
  }
}
