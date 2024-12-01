import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient,private endpoint:AppEndpointsService,private authentication:AuthenticationService) { }
  login(user:any):Observable<any>{
    return this.http.post<any>(this.endpoint.user.login,user)
  }
  signup(user:any):Observable<any>{
    return this.http.post<any>(this.endpoint.user.singup,user)
  }
  getAll(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.user.getAll,{headers})
  }
  getUserByEmail(user_email:string){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.user.getUser+"/"+user_email,{headers})
  }
  getUserProfilel(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.user.profile,{headers})
  }
  getTotalUsers(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.user.getTotalUsers,{headers})
  }
  getMyCourses(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.user.myCourses,{headers})
  }
  forgotPassword(user:any):Observable<any>{
    return this.http.post<any>(this.endpoint.user.forgotPassword,user)
  }
  updateDetails(user:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.put<any>(this.endpoint.user.updateUser,user,{headers})
  }
  updateEmail(email:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.put<any>(this.endpoint.user.updateEmail,email,{headers})
  }
  updatePhoneNumber(phoneNumber:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.put<any>(this.endpoint.user.updatePhoneNumber,phoneNumber,{headers})
  }
}
