import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppEndpointsService } from '../app-endpoints.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private http: HttpClient, private endpoint: AppEndpointsService, private authentication: AuthenticationService) { }
  getCourses(): Observable<any> {
    return this.http.get<any>(this.endpoint.course.getAllCourses)
  }
  getCourseByName(courseName: string): Observable<any> {
    const headers: HttpHeaders = this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.course.getCourseByName + "/" + courseName, { headers })
  }
  getTotalNumberOfCourses(): Observable<any> {
    const headers: HttpHeaders = this.authentication.getHeaders()
    return this.http.get<any>(this.endpoint.course.getTotalCourses, { headers })
  }
  addCourse(course: any): Observable<any> {
    const headers: HttpHeaders = this.authentication.getHeaders()
    return this.http.post<any>(this.endpoint.course.addCourse, course, { headers })
  }
  getContent(course_name: string): Observable<any> {
    const headers: HttpHeaders = this.authentication.getHeaders();
    const params = new HttpParams().set('course_name', course_name);
    return this.http.get<any>(this.endpoint.course.getContent, { headers, params });
  }
  getOverview(courseName:string):Observable<any>{
    // const headers: HttpHeaders = this.authentication.getHeaders();
    return this.http.get<any>(this.endpoint.course.baseUrl+"/"+courseName+'/overview')
  }
  getUserRegisteredCourses():Observable<any>{
    const headers: HttpHeaders = this.authentication.getHeaders();
    return this.http.get<any>(this.endpoint.course.getRegisteredCourses,{headers})
  }
  getAvailableCourses():Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders();
    return this.http.get<any>(this.endpoint.course.getAvailableCoursesToRegister,{headers})
  }
  updateCourse(course:any):Observable<any>{
    const headers:HttpHeaders=this.authentication.getHeaders();
    return this.http.put<any>(this.endpoint.course.baseUrl,course,{headers})
  }

}
