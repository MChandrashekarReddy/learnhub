import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  private scrollSubscription!:Subscription
  @ViewChild('footer') footer!:ElementRef;
  message: string | null = null;
  activeCategory:string|null=null
  constructor(
    private scrollservice:ScrollService,
    private element:ElementRef,
    private router:Router,
  ) { }
  ngOnInit(): void {
  //   console.log("Home"); 
  //   if(localStorage.getItem('token')) {
  //     const role = localStorage.getItem('role');
  //     this.router.navigate([`/${role}`]);
  // }
}
  ngAfterViewInit() {
    this.scrollSubscription = this.scrollservice.scrollToSection.subscribe(sectionId => {
      const element = this.element.nativeElement.querySelector(`#${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
  
 
}


