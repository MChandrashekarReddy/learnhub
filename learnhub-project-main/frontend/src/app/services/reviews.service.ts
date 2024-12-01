import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private endPoint:AppEndpointsService,private http:HttpClient,private authentication:AuthenticationService) { }

  getReviews(courseName:string):Observable<any>{
    // const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endPoint.review.baseUrl+"/"+courseName);
  }
  addReview(courseName:string,review:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endPoint.review.baseUrl+"/"+courseName,review,{headers});
  }
}
