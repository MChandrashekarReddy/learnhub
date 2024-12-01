import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {

  constructor(private endPoint:AppEndpointsService,private http:HttpClient,private authentication:AuthenticationService) { }

  getDiscussions(courseName:string):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.get<any>(this.endPoint.questions.baseUrl+"/"+courseName+'/discussions',{headers});
  }
  addAnswer(answerBody:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endPoint.answers.addAnswer,answerBody,{headers});
  }
  addQuestion(question:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders()
    return this.http.post<any>(this.endPoint.questions.baseUrl,question,{headers});
  }
}
 
