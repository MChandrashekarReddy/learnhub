import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentsService {

  constructor(private http:HttpClient,private endpoint:AppEndpointsService,private authentication:AuthenticationService) { }
  addContent(content:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endpoint.content.addContent,content,{headers})
  }
  getContent(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders();
    return this.http.get<any>(this.endpoint.content.baseUrl+"/"+courseName+'/content',{headers});
  }
  getAssignments(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.content.baseUrl+"/"+courseName+'/assignments',{headers});
  }
  getMaterials(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.content.baseUrl+"/"+courseName+'/materials',{headers});
  }
  getVideos(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.content.baseUrl+"/"+courseName+'/videos',{headers});
  }
  getVideo(contentId:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endpoint.content.getVideo,{"content_id":contentId},{headers});
  }
  getOverViewContent(courseName:string):Observable<any>{
    return this.http.get<any>(this.endpoint.content.baseUrl+"/"+courseName);
  }
}
