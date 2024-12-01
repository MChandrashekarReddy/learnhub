import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AuthenticationService } from './authentication.service';
import { AppEndpointsService } from '../app-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private httpClient:HttpClient,private authentication:AuthenticationService,private endpoint:AppEndpointsService) { }

  getAllPayments(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.get<any>(this.endpoint.payments.getAllPayments,{headers})
  }
  myTransactions(params?:HttpParams){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.httpClient.get<any>(this.endpoint.payments.myPayments,{headers,params})
  }
}
