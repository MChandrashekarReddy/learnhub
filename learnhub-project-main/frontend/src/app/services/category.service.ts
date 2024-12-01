import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http:HttpClient,private endpoint:AppEndpointsService,private authentication:AuthenticationService) { }
  getCategories():Observable<any>{
    return this.http.get<any>(this.endpoint.category.getAllCategories)
  }
  addCategory(category:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endpoint.category.addCategory,category,{headers})
  }
  getTotalCategories(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.category.getTotalCategories,{headers})
  }
  getAllCategoriesdeatils(){
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.category.getAllTotalCategories,{headers})
  }
}
