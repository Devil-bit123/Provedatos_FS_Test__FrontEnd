import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Empleado } from '../../core/interfaces/Empleado/empleado';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProvinciaService } from '../../core/services/Provincia/provincia.service';
import { Provincia } from '../../core/interfaces/Provincia/provincia';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangeDetectorRef } from '@angular/core';
import { EmpleadoService } from '../../core/services/Empleado/empleado.service';
import moment from 'moment';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-empleado-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    NgxFileDropModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './empleado-dialog.component.html',
  styleUrl: './empleado-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class EmpleadoDialogComponent implements OnInit {
  accion: string;
  tituloModal: string = '';
  textoBotonOkModal: string = '';
  empleadoARecibir: Empleado;

  public _provinciasService = inject(ProvinciaService);
  public _empleadoService = inject(EmpleadoService);
  provincias: Provincia[] = [];
  public formBuild = inject(FormBuilder);

  public formEmpleado: FormGroup = this.formBuild.group({
    id: [''],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    cedula: ['', [Validators.required]],
    provincia: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    observaciones: [''],
    fotografia: [''],
    fecha_ingreso: ['', Validators.required],
    cargo: ['', Validators.required],
    departamento: ['', Validators.required],
    provincia_laboral: ['', Validators.required],
    sueldo: ['', Validators.required],
    jornada_parcial: [''],
    observaciones_laborales: [''],
  });

  public files: NgxFileDropEntry[] = [];
  public filePreview: string[] = [];
  public errorFileImput: boolean = false;
  public inDetailOrDelete: boolean = false;
  public inEdit: boolean = false;
  fotografiaActual: string = '';
  haveError: boolean = false;
  Errores: string = '';
  private _snackBar = inject(MatSnackBar);

  @Output() actionCompleted = new EventEmitter<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { accion: string; empleadoARecibir: Empleado },
    private provinciasService: ProvinciaService,
    private cdr: ChangeDetectorRef,
    private empleadoService: EmpleadoService,
    public dialogRef: MatDialogRef<EmpleadoDialogComponent>
  ) {
    this.accion = data.accion;
    this.empleadoARecibir = data.empleadoARecibir;
    this.getProvincias();
    //console.log(this.accion);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    //console.log(this.fotografiaActual);
    switch (this.accion) {
      case 'Editar':
        this.tituloModal = 'Edicion de empleado';
        this.textoBotonOkModal = 'Editar';
        this.inEdit = true;
        this.fotografiaActual = `${environment.imagesUrl}${this.empleadoARecibir.fotografia}`;
        if (this.empleadoARecibir) {
          this.formEmpleado.patchValue({
            id: this.empleadoARecibir.id,
            nombres: this.empleadoARecibir.nombres,
            apellidos: this.empleadoARecibir.apellidos,
            cedula: this.empleadoARecibir.cedula,
            provincia: this.empleadoARecibir.provincia,
            fecha_nacimiento: this.empleadoARecibir.fecha_nacimiento,
            email: this.empleadoARecibir.email,
            observaciones: this.empleadoARecibir.observaciones,
            fotografia: '',
            fecha_ingreso: this.empleadoARecibir.fecha_ingreso,
            cargo: this.empleadoARecibir.cargo,
            departamento: this.empleadoARecibir.departamento,
            provincia_laboral: this.empleadoARecibir.provincia_laboral,
            sueldo: this.empleadoARecibir.sueldo,
            jornada_parcial: this.empleadoARecibir.jornada_parcial,
            observaciones_laborales:
              this.empleadoARecibir.observaciones_laborales,
          });
        }

        break;

      case 'Eliminar':
        this.tituloModal = 'Eliminacion de empleado';
        this.textoBotonOkModal = 'Eliminar';
        this.inDetailOrDelete = true;
        this.fotografiaActual = `${environment.imagesUrl}${this.empleadoARecibir.fotografia}`;
        this.setFormControlsDisabledState(true);
        if (this.empleadoARecibir) {
          this.formEmpleado.patchValue({
            id: this.empleadoARecibir.id,
            nombres: this.empleadoARecibir.nombres,
            apellidos: this.empleadoARecibir.apellidos,
            cedula: this.empleadoARecibir.cedula,
            provincia: this.empleadoARecibir.provincia,
            fecha_nacimiento: this.empleadoARecibir.fecha_nacimiento,
            email: this.empleadoARecibir.email,
            observaciones: this.empleadoARecibir.observaciones,
            fotografia: `${environment.imagesUrl}${this.empleadoARecibir.fotografia}`,
            fecha_ingreso: this.empleadoARecibir.fecha_ingreso,
            cargo: this.empleadoARecibir.cargo,
            departamento: this.empleadoARecibir.departamento,
            provincia_laboral: this.empleadoARecibir.provincia_laboral,
            sueldo: this.empleadoARecibir.sueldo,
            jornada_parcial: this.empleadoARecibir.jornada_parcial,
            observaciones_laborales:
              this.empleadoARecibir.observaciones_laborales,
          });
        }
        break;

      case 'Detalles':
        this.tituloModal = 'Detalles del empleado';
        this.textoBotonOkModal = 'Ok';
        this.inDetailOrDelete = true;
        this.fotografiaActual = `${environment.imagesUrl}${this.empleadoARecibir.fotografia}`;
        //console.log(this.fotografiaActual);
        this.setFormControlsDisabledState(true);
        if (this.empleadoARecibir) {
          this.formEmpleado.patchValue({
            id: this.empleadoARecibir.id,
            nombres: this.empleadoARecibir.nombres,
            apellidos: this.empleadoARecibir.apellidos,
            cedula: this.empleadoARecibir.cedula,
            provincia: this.empleadoARecibir.provincia,
            fecha_nacimiento: this.empleadoARecibir.fecha_nacimiento,
            email: this.empleadoARecibir.email,
            observaciones: this.empleadoARecibir.observaciones,
            fotografia: `${environment.imagesUrl}${this.empleadoARecibir.fotografia}`,
            fecha_ingreso: this.empleadoARecibir.fecha_ingreso,
            cargo: this.empleadoARecibir.cargo,
            departamento: this.empleadoARecibir.departamento,
            provincia_laboral: this.empleadoARecibir.provincia_laboral,
            sueldo: this.empleadoARecibir.sueldo,
            jornada_parcial: this.empleadoARecibir.jornada_parcial,
            observaciones_laborales:
              this.empleadoARecibir.observaciones_laborales,
          });
        }

        break;

      case 'Crear':
        this.tituloModal = 'Creacion de empleado';
        this.textoBotonOkModal = 'Crear';
        this.inDetailOrDelete = false;
        break;

      default:
        this.tituloModal = '';
        break;
    }
  }

  getProvincias() {
    this._provinciasService.GetProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  botonOk(accion: string, empleado?: Empleado) {
    //console.log('Acción desde le boton:', accion); // Verifica el valor de la acción

    if (this.formEmpleado.invalid) {
      this.formEmpleado.markAllAsTouched();
      console.error('Formulario inválido:', this.formEmpleado.invalid);
      // No se realiza ninguna acción adicional si el formulario es inválido
      return;
    }

    switch (accion) {
      case 'Editar':
        // Verifica el estado del formulario
        if (this.formEmpleado.invalid) {
          this.formEmpleado.markAllAsTouched();
          console.error('Formulario inválido:', this.formEmpleado.invalid);
          return;
        } else {
          this.inEdit = true;
          //console.log('OK'); // Solo se muestra si el formulario es válido
          //console.log('formulario:', this.formEmpleado);

          let fecha_nacimiento = moment(
            this.formEmpleado.value.fecha_nacimiento
          );
          let fecha_ingreso = moment(this.formEmpleado.value.fecha_ingreso);
          const formData = new FormData();
          formData.append('nombres', this.formEmpleado.value.nombres);
          formData.append('apellidos', this.formEmpleado.value.apellidos);
          formData.append('cedula', this.formEmpleado.value.cedula);
          formData.append('provincia', this.formEmpleado.value.provincia);
          formData.append(
            'fecha_nacimiento',
            fecha_nacimiento.format('YYYY-MM-DD')
          );
          formData.append('email', this.formEmpleado.value.email);
          formData.append(
            'observaciones',
            this.formEmpleado.value.observaciones
          );
          if (this.formEmpleado.get('fotografia')?.value) {
            formData.append(
              'fotografia',
              this.formEmpleado.get('fotografia')?.value
            );
          }
          formData.append('fecha_ingreso', fecha_ingreso.format('YYYY-MM-DD'));
          formData.append('cargo', this.formEmpleado.value.cargo);
          formData.append('departamento', this.formEmpleado.value.departamento);
          formData.append(
            'provincia_laboral',
            this.formEmpleado.value.provincia_laboral
          );
          formData.append('sueldo', this.formEmpleado.value.sueldo);
          formData.append(
            'jornada_parcial',
            this.formEmpleado.value.jornada_parcial ? 'true' : 'false'
          );
          formData.append(
            'observaciones_laborales',
            this.formEmpleado.value.observaciones_laborales
          );
          //console.log(this.formEmpleado.get('fotografia')?.value);
          this._empleadoService
            .PutEmpleado(this.formEmpleado.value.id, formData)
            .subscribe({
              next: (response) => {
                //console.log(response);
                this.dialogRef.close({ accion: 'Editar' });
                this.actionCompleted.emit('Editar');
              },
              error: (error) => {
                this.haveError = true;
                this.Errores = this.extractErrorMessages(error);
                this.openSnackBar(this.Errores, 'Ok');
                console.error(error);
              },
            });

        }

        break;

      case 'Eliminar':
        //console.log('Accion del dialogo al presionar el boton ok',accion);
        this._empleadoService
          .DeleteEmpleado(this.formEmpleado.value.id)
          .subscribe({
            next: (response) => {
              // Confirmar eliminación exitosa
              console.info('Empleado eliminado exitosamente.', response);
              this.actionCompleted.emit('Eliminar');
              this.dialogRef.close({ accion: 'Eliminar' });
            },
            error: (error) => {
              this.haveError = true;
              this.Errores = this.extractErrorMessages(error);
              console.error('Error al eliminar el empleado:', error);
              this.openSnackBar(this.Errores, 'Ok');
            }
          });
        break;

      case 'Detalles':
        //console.log(accion);
        this.actionCompleted.emit('Detalles');
        this.dialogRef.close({ accion: 'Detalles' });
        break;
      case 'Crear':
        //console.log('Formulario inválido:', this.formEmpleado.invalid); // Verifica el estado del formulario
        if (this.formEmpleado.invalid) {
          this.formEmpleado.markAllAsTouched();
          console.error('Formulario inválido:', this.formEmpleado.invalid);
          return;
        } else {
          let fecha_nacimiento = moment(
            this.formEmpleado.value.fecha_nacimiento
          );
          let fecha_ingreso = moment(this.formEmpleado.value.fecha_ingreso);

          const formData = new FormData();
          formData.append('nombres', this.formEmpleado.value.nombres);
          formData.append('apellidos', this.formEmpleado.value.apellidos);
          formData.append('cedula', this.formEmpleado.value.cedula);
          formData.append('provincia', this.formEmpleado.value.provincia);
          formData.append(
            'fecha_nacimiento',
            fecha_nacimiento.format('YYYY-MM-DD')
          );
          formData.append('email', this.formEmpleado.value.email);
          formData.append(
            'observaciones',
            this.formEmpleado.value.observaciones
          );

          if (this.formEmpleado.get('fotografia')?.value) {
            formData.append(
              'fotografia',
              this.formEmpleado.get('fotografia')?.value
            );
          }

          formData.append('fecha_ingreso', fecha_ingreso.format('YYYY-MM-DD'));
          formData.append('cargo', this.formEmpleado.value.cargo);
          formData.append('departamento', this.formEmpleado.value.departamento);
          formData.append(
            'provincia_laboral',
            this.formEmpleado.value.provincia_laboral
          );
          formData.append('sueldo', this.formEmpleado.value.sueldo);
          formData.append(
            'jornada_parcial',
            this.formEmpleado.value.jornada_parcial ? 'true' : 'false'
          );
          formData.append(
            'observaciones_laborales',
            this.formEmpleado.value.observaciones_laborales
          );

          this._empleadoService.PostEmpleado(formData).subscribe({
            next: (response) => {
              this.dialogRef.close({ accion: 'Crear' });
              this.actionCompleted.emit('Crear');
            },
            error: (error) => {
              this.haveError = true;
              this.Errores = this.extractErrorMessages(error);
              this.openSnackBar(this.Errores, 'Ok');
            },
          });
        }

        break;

      default:
        this.tituloModal = '';
        break;
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    // Limita a un solo archivo
    if (files.length > 1) {
      this.errorFileImput = true;
      console.error('Solo se permite cargar un archivo.');
      return;
    }

    // Limpia el estado previo
    this.files = [];
    this.filePreview = [];
    this.errorFileImput = false;

    const allowedExtensions = ['.png', '.jpeg', '.jpg'];
    let hasInvalidFiles = false;

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const fileName = file.name.toLowerCase();
          const fileExtension = fileName.slice(
            ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
          );

          if (!allowedExtensions.includes(`.${fileExtension}`)) {
            hasInvalidFiles = true;
            this.errorFileImput = true;
            console.error('Unsupported file type:', file.name);
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              this.filePreview.push(reader.result as string);
              this.cdr.detectChanges();
            };
            this.formEmpleado.get('fotografia')?.setValue(file);
            reader.readAsDataURL(file);

            //console.log(file);

          }

          this.cdr.detectChanges();
        });
      } else {
        hasInvalidFiles = true;
        this.errorFileImput = true;
        console.error('Unsupported file type:', droppedFile.fileEntry);
      }
    }

    if (hasInvalidFiles) {
      // Optionally provide feedback to the user about invalid files
    }
  }

  public fileOver(event: any) {}

  public fileLeave(event: any) {}

  setFormControlsDisabledState(disabled: boolean) {
    if (disabled) {
      this.formEmpleado.disable();
    } else {
      this.formEmpleado.enable();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  extractErrorMessages(error: any): string {
    let messages = '';
    if (error?.error?.errors) {
      // Recorre el objeto de errores y concatena los mensajes
      for (const field in error.error.errors) {
        if (error.error.errors.hasOwnProperty(field)) {
          messages += `${field}: ${error.error.errors[field].join(', ')}\n`;
        }
      }
    } else {
      messages = 'Error desconocido';
    }
    return messages;
  }
}
