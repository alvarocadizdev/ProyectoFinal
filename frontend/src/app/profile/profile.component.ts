import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports :[FormsModule],
})
export class ProfileComponent implements OnInit {
  profile = { interests: '', goals: '' };

  constructor(private http: HttpClient, private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
  

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:3000/api/profile', { headers }).subscribe({
      next: (res) => this.profile = res,
      error: (err) => console.error(err)
    });
  }

  saveProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:3000/api/profile', this.profile, { headers }).subscribe({
      next: () => alert('Perfil guardado'),
      error: err => alert('Error al guardar perfil')
    });
  }
}
