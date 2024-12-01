import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private endpoints:AppEndpointsService,private httpClient:HttpClient,private authentication:AuthenticationService) {

   }
   generateOTP(user:any):Observable<any>{
    return this.httpClient.post<any>(this.endpoints.email.baseurl, user);
   }
   verifyOTP(user:any):Observable<any>{
    return this.httpClient.post<any>(this.endpoints.email.verifyOtp, user);
   }
   resetPassword(email:string):Observable<any>{
    return this.httpClient.post<any>(this.endpoints.email.resetPassword,{"email":email});
   }
   sendOTPForEmailUpdate():Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.get<any>(this.endpoints.email.requestForUpdateEmail,{headers})
   }
   requestForOTPUpdation(otp:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.post<any>(this.endpoints.email.verifyOTPForReqeuestOfEmailUpdate,otp,{headers})
   }
   verifyNewEmail(Email:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.post<any>(this.endpoints.email.verifyNewEmail,Email,{headers})
   }
   updatePhoneNumberEmail():Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.get<any>(this.endpoints.email.updatePhoneNumber,{headers});
   }
}
