import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private endPoint:AppEndpointsService,private http:HttpClient,private authentication:AuthenticationService) { }

  getCourseProgress(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endPoint.progress.baseUrl+"/"+courseName,{headers});
  }
  addProgress(progress:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endPoint.progress.baseUrl,progress,{headers});
  }
  deleteProgress(contentId:string,courseName:string): Observable<any> {
    const headers: HttpHeaders = this.authentication.getHeaders();
    return this.http.delete<any>( `${this.endPoint.progress.baseUrl}/${courseName}/${contentId}`,{headers});
  }
  
}
