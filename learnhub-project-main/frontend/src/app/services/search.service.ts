import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchCourseSource = new BehaviorSubject<string>('');
  currentSearchCourse = this.searchCourseSource.asObservable();
  private currentCourseSource = new BehaviorSubject<string>('');
  currentCourse=this.currentCourseSource.asObservable();
  private isProfileChange = new BehaviorSubject<boolean>(false);
  getProfileStatus=this.isProfileChange.asObservable();
  constructor() {}

  changeSearchCourse(searchCourse: string) {
    this.searchCourseSource.next(searchCourse);
  }
  setCourseName(courseName: string) {
    this.currentCourseSource.next(courseName);
  }
  changeProfileStatus(status: boolean) {
    this.isProfileChange.next(status);
  }

}
