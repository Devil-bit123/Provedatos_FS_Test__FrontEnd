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
import { Router, RouterLink, } from '@angular/router';


@Component({
  selector: 'app-empleado-index',
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
    MatProgressSpinnerModule,
    RouterLink


  ],
  templateUrl: './empleado-index.component.html',
  styleUrls: ['./empleado-index.component.css'],

})
export class EmpleadoIndexComponent implements AfterViewInit {
  displayedColumns: string[] = ['nombres', 'id', 'estado','acciones' ];
  dataSource: MatTableDataSource<any>;

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
    console.log('Paginator:', this.paginator);
    console.log('Sort:', this.sort);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Verifica que sort está configurado
    console.log('DataSource Sort:', this.dataSource.sort);
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

  navigateToReporte() {
    this.router.navigate(['reporte']);
  }

}


