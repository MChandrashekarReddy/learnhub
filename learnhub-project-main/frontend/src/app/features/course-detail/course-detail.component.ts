import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'jquery';
import { CoursesService } from 'src/app/services/courses.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  standalone:false,
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  enrollments: Enrollment[] = [];
  constructor(private activatedRoute:ActivatedRoute,private courseService:CoursesService,private userdataService:UserDataService,private router:Router) {
    
   }

  ngOnInit(): void {
    const courseName = this.activatedRoute.snapshot.paramMap.get('name');
    if (courseName) {
      this.getCourseDetails(courseName);
    }
  }
  getCourseDetails(courseName:string){
      this.courseService.getCourseByName(courseName).subscribe(
        (data: CourseDetailsResponse) => {
          this.course = data.course;
          this.enrollments = data.enrollments;
        },
        error=>{
          console.log(error.error.message)
        }
      )
    }
    onclick(event:Event){
      const target = event.target as HTMLSelectElement | null;
      if(target){
        this.userdataService.setEmail(target.textContent+"")
        this.router.navigate(['/admin/studentDetail'],{skipLocationChange:true});
      }
    }
}
export interface Course {
  course_name: string;
  course_img: string;
  course_description: string;
  course_instructor_name: string;
  course_category_name: string;
  course_price: string;
  course_created_at: string;
  no_of_enrollments: number;
  ratings: number;
}

export interface Enrollment {
  user_name: string;
  user_email: string;
  course_name: string;  
  enrolle_date: string;
  amount: string;
  payment_id: string;
  payment_mode: string;
  payment_at: string;
  course_category:string;
}

export interface CourseDetailsResponse {
  course: Course;
  enrollments: Enrollment[];
}

