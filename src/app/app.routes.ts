import { RouterModule, Routes } from '@angular/router';
import { EmpleadoIndexComponent } from './empleado/empleado-index/empleado-index.component';
import { EmpleadoReportComponent } from './empleado/empleado-report/empleado-report.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
  { path: 'reporte', component: EmpleadoReportComponent },
  { path: '', component: EmpleadoIndexComponent } // Ruta por defecto o inicial
];


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Importa las rutas
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
