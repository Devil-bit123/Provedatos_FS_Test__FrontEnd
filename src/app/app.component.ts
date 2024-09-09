import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmpleadoIndexComponent } from './empleado/empleado-index/empleado-index.component';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmpleadoIndexComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Provedatos_FS_Test__FrontEnd';
}
