import { Component, AfterViewInit, ViewChild, OnInit, inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../core/services/Empleado/empleado.service';
import { Empleado } from '../../core/interfaces/Empleado/empleado';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EmpleadoDialogComponent } from '../empleado-dialog/empleado-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-empleado-report',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    EmpleadoDialogComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './empleado-report.component.html',
  styleUrl: './empleado-report.component.css'
})
export class EmpleadoReportComponent {

  displayedColumns: string[] = ['nombres', 'cedula', 'id','nombre_provincia','fecha_nacimiento','email','observaciones','fecha_ingreso','cargo','departamento','provincia_laboral','sueldo','jornada_parcial','observaciones_laborales'];
  dataSource: MatTableDataSource<Empleado>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly _empleadosService = inject(EmpleadoService);

  readonly dialog = inject(MatDialog);

  public itsLoading=false;

  constructor( private empleadosService:EmpleadoService,private matPaginatorIntl: MatPaginatorIntl,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
    this.customizePaginatorLabels();
    this.GetEmpledos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => {
      this.customizePaginatorLabels();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GetEmpledos():void{
    this._empleadosService.GetEmpleados().subscribe({
      next:(empleados)=>{
        this.dataSource.data=empleados;
        //console.log(this.dataSource.data);
      },error:(error)=>{
        console.error(error);
      }
    });
  }

  customizePaginatorLabels() {
    const pageSize = this.paginator?.pageSize || 5; // valor por defecto
    this.matPaginatorIntl.itemsPerPageLabel = `Uncamente se estan mostrando los primeros ${pageSize} registros. Si no encuentra la información por favor utilice el filtro de la parte superior.`;
  }

  openDialog(accion: string, empleado?: Empleado) {
    const dialogRef = this.dialog.open(EmpleadoDialogComponent, {
      data: { accion, empleadoARecibir: empleado },
    });

    // Escuchar el evento cuando el diálogo se cierra
    dialogRef.componentInstance.actionCompleted.subscribe((action: string) => {
      //console.log('Acción recibida en el componente principal:', action);
      if (action === 'Eliminar' || action === 'Editar' || action === 'Detalles' || action === 'Crear') {
        this.GetEmpledos(); // Actualizar la tabla
      }
      this.itsLoading = false;
    });

    dialogRef.afterClosed().subscribe(() => {
      this.itsLoading = false;
    });
  }

  navigateToIndex() {
    this.router.navigate(['']);
  }

  downloadFile() {

    var now = moment();
    var fileName = "Reporte_Empleados_"+now.toString()+"_.xlsx";

    this._empleadosService.downloadReport().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName; // Cambia el nombre del archivo según corresponda
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }



}
