import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], //mandamos los imports a nuestro archivo html
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal([
    'Tomarme un mate',
    'Crear mi primer proyecto en Angular',
    'Hacer mis sprites',
    'Subir mis cambios a GitLab',
  ]);
}
