import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {

  constructor(private endpoint:AppEndpointsService,private httpClient:HttpClient,private authentication:AuthenticationService) { }
   getTotalEnrollments(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.get<any>(this.endpoint.enrollments.getTotalEnrollments,{headers})
   }
   addEnrollement(enrollment:any){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.post<any>(this.endpoint.enrollments.addEnrollments,enrollment,{headers})
   }
}
