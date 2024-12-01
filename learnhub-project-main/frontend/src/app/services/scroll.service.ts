import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollToSectionSubject = new Subject<string>();
  scrollToSection = this.scrollToSectionSubject.asObservable();

  scrollTo(sectionId: string) {
    this.scrollToSectionSubject.next(sectionId);
  }
  constructor() { }
}
