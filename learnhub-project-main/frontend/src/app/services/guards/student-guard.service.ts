import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuardService implements CanActivate {

  constructor(private authService:AuthenticationService,private router:Router) { }
  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isStudentLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
