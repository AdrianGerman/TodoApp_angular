import { Component } from '@angular/core';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  welcome = 'Bienvenidos a mi primer aplicación de angular';
  tasks = [
    'Instalara angular CLI',
    'Crear el primer proyecto',
    'Crear componente',
    'Crear servicios',
  ];
}
