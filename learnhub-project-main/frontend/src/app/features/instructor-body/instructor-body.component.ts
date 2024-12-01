import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-instructor-body',
  templateUrl: './instructor-body.component.html',
  standalone:false,
  styleUrls: ['./instructor-body.component.css']
})
export class InstructorBodyComponent implements OnInit {
  @ViewChild('searchCourses') mySection!: ElementRef;
  searchCourse: string ='';
  message: string | null = null;
  topCourses:Course[]=[]
  recentlyAddeddCourses:Course[]=[]
  courses:Course[]=[]
  serchedCourses:Course[]=[]
  filteredCourses: Course[] = [];
  categories: Category[] = [];
  selectedCategories: string[] = [];
  img:string=''
  pageSize: number = 10;
  pageIndex: number = 0;
  isModalOpen = false;
  courseToAddContent:string="";
  constructor(private router:Router,private usersService:UserService,private searchService:SearchService) { }
  ngOnInit(): void {
    this.getMyCourses()
    this.searchService.currentSearchCourse.subscribe((searchCourse) => {
      this.searchCourse = searchCourse;
    });
  }
  addcontent(courseName:string,event:Event){
    event.stopPropagation();
    this.courseToAddContent=courseName
  }
  getMyCourses(){
    this.usersService.getMyCourses().subscribe(
      data=>{
        this.courses=data;
        this.filteredCourses = [...this.courses]; 
        this.topCourses=this.getTopCourses()
        this.recentlyAddeddCourses=this.getTopRecentlyAddedCourses()
      },
      error=>{
        console.log(error.error.message)
      }
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
      stars.push('fa-star-o'); 
    }

    return stars;
  }
  getTopCourses(): Course[] {
    return this.courses
      .filter(course => course.no_of_enrollments >= 1)
      .sort((a, b) => b.no_of_enrollments - a.no_of_enrollments)
      .slice(0, 3); 
  }
  getTopRecentlyAddedCourses(): Course[] {
    return this.courses
      .sort((a, b) => new Date(b.course_created_at).getTime() - new Date(a.course_created_at).getTime()) 
      .slice(0, 3); 
  }
  
editContent(event:Event,courseName:string){
    event.stopPropagation();
    this.router.navigate([`instructor/edit/course/${courseName}`])
  }

}
interface Course {
  course_img: string;
  course_name: string;
  course_description: string;
  course_price: number;
  ratings: number;
  course_category_name: string;
  no_of_enrollments: number;
  course_created_at:string
}
interface Category {
  category_name: string;
  no_of_courses: number;
}
