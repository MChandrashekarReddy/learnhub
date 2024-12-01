import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { data } from 'jquery';
import { CoursesService } from 'src/app/services/courses.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-my-learnings',
  templateUrl: './my-learnings.component.html',
  standalone:false,
  styleUrls: ['./my-learnings.component.css']
})
export class MyLearningsComponent implements OnInit {
  courses:Course[]=[]
  constructor(private router:Router,private courseService:CoursesService,private progressService:ProgressService) { }

  ngOnInit(): void {
    this.getRegisteredCourses()
  }
  getRegisteredCourses(){
    this.courseService.getUserRegisteredCourses().subscribe(
      data=>{
        this.courses=data;
      },
      error=>console.error(error.error.message)
    )
  }
  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push('fa-star'); 
    }
    if (halfStars) {
      stars.push('fa-star-half-alt'); 
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push('fa-regular fa-star'); 
    }
    return stars;
  }
  openCourse(courseName:string){
    this.router.navigate([`student/courses/${courseName}`])
  }

}
interface Course {
  course_category_name: string;   
  course_description: string;     
  course_img: string;
  course_name: string;                  
  ratings: number;
  completion_percentage: number;
}
