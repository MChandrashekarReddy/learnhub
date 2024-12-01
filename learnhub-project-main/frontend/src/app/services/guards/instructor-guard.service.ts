import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorGuardService implements CanActivate{

  constructor(private authService:AuthenticationService,private router:Router) { }
  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isInstructorLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
