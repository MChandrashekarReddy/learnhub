import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }
  email:string=''
  currentEmail():string{
    return this.email
  }

  setEmail(email: string) {
    this.email=email;
  }
}
