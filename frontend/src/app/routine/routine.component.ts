import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RoutineComponent {
  routine = { day: '', time: '', activity: '' };
 
  constructor(private http: HttpClient, private router: Router) {}

  addRoutine() {
    console.log('Rutina añadida:', this.routine);
    // Aquí puedes agregar la lógica para enviar la rutina al backend
    alert('Rutina añadida con éxito');
  }


  saveRoutine() {
    const token = localStorage.getItem('token');  // Asegúrate de que el token está guardado en el localStorage
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:3000/api/routines', this.routine, { headers })
      .subscribe({
        next: () => alert('Rutina guardada'),
        error: err => alert('Error al guardar rutina: ' + err.message)
      });
  }


  submitRoutine() {
    this.http.post('http://localhost:3000/api/routines', this.routine, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (res) => {
        console.log('✅ Rutina guardada:', res);
        alert('Rutina guardada con éxito');
      },
      error: (err) => {
        console.error('❌ Error al guardar rutina:', err);
        alert('Error al guardar rutina');
      }
    });
  }  


  goBack() {
    this.router.navigate(['/dashboard']);  // Si deseas redirigir al dashboard después de guardar la rutina
  }
}
