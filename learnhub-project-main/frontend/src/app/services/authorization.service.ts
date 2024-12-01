import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements CanActivate {

  constructor(private authService:AuthenticationService,private router:Router) { }
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      if(localStorage.getItem('token')) {
        const role = localStorage.getItem('role');
        this.router.navigate([`/${role}`]);
    }
      return false;
    }
    return true
  }
  
}
