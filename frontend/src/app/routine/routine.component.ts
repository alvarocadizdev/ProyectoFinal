import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrl: './routine.component.css',
  imports: [CommonModule, FormsModule]
})
export class RoutineComponent implements OnInit {
  routine = { day: '', time: '', activity: '' };
  routines: any[] = [];
  groupedRoutines: { [day: string]: any[] } = {};
  editingRoutine: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchRoutines();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  fetchRoutines() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/routines', { headers })
      .subscribe({
        next: data => {
          this.routines = data;
          this.groupedRoutines = this.groupByDay(data);
        },
        error: err => {
          console.error('Error al cargar rutinas:', err);
          alert('Error al cargar rutinas');
        }
      });
  }

  groupByDay(routines: any[]): { [day: string]: any[] } {
    return routines.reduce((acc: any, routine: any) => {
      const day = routine.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(routine);
      return acc;
    }, {});
  }

  saveRoutine() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:3000/api/routines', this.routine, { headers })
      .subscribe({
        next: () => {
          alert('Rutina guardada');
          this.routine = { day: '', time: '', activity: '' };
          this.fetchRoutines();
        },
        error: err => alert('Error al guardar rutina: ' + err.message)
      });
  }

  deleteRoutine(routineId: string): void {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = `http://localhost:3000/api/routines/${routineId}`;

    this.http.delete(url, { headers })
      .subscribe({
        next: () => {
          alert('Rutina eliminada');
          this.fetchRoutines();
        },
        error: (err) => {
          console.error('Error al eliminar rutina:', err);
          alert('Error al eliminar rutina');
        }
      });
  }

  editRoutine(routine: any) {
    this.editingRoutine = { ...routine };
  }

  updateRoutine() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put(`http://localhost:3000/api/routines/${this.editingRoutine.id}`, this.editingRoutine, { headers })
      .subscribe({
        next: () => {
          alert('Rutina actualizada');
          this.editingRoutine = null;
          this.fetchRoutines();
        },
        error: err => {
          console.error('Error al actualizar rutina:', err);
          alert('Error al actualizar rutina');
        }
      });
  }

  cancelEdit() {
    this.editingRoutine = null;
  }
}
