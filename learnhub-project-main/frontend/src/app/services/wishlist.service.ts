import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private endPoints:AppEndpointsService,private http:HttpClient,private authentication:AuthenticationService) { }
  addCourseToWishList(course:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endPoints.wishlist.baseUrl,course,{headers});
  }
  deleteCourseFromwhisList(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.delete<any>(this.endPoints.wishlist.baseUrl+"/"+courseName,{headers});
  }
  getWishList():Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endPoints.wishlist.baseUrl,{headers});
  }
}
