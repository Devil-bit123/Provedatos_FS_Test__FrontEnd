import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from '../../interfaces/Provincia/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  baseUrl=environment.apiUrl;
  private http = inject(HttpClient)

  constructor() {
    console.log(this.baseUrl);
  }

  GetProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.baseUrl}provincias`);
  }
}
