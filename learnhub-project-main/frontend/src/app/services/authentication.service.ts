import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor() { }
  login(token:string,role:string,img:string,name:string){
    localStorage.setItem('token',token)
    localStorage.setItem('role',role)
    localStorage.setItem('img',img)
    localStorage.setItem('name',name)
  }
  isLoggedIn(): boolean {
    return !(!localStorage.getItem('token'));
  }
  isInstructorLoggedIn(): boolean {
    return localStorage.getItem('role') === 'instructor';
  }
  isStudentLoggedIn(): boolean {
    return localStorage.getItem('role') === 'student';
  }
  isAdminLoggedIn(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  getHeaders(){
    return new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem('token')}`})
  }
}
