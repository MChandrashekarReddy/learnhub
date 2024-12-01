import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-student-body',
  templateUrl: './student-body.component.html',
  standalone:false,
  styleUrls: ['./student-body.component.css']
})
export class StudentBodyComponent implements OnInit {
  courses: Course[] = [];
  categories: Category[] = [];
  filteredCourses: Course[] = [];
  message: string | null = null;
  activeCategory: string | null = null;
  topCourse!: Course;
  userName: string | null = null;
  registeredCourses: Course[] = [];
  availableCourses: Course[] = [];
  topRegisteredCourses: Course[] = [];
  topAvaliableCourses:Course[]=[]
  image!:File

  constructor(
    private courseservice: CoursesService,
    private categoryService: CategoryService,
    private router:Router,
    private wishlistService:WishlistService
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.loadCourses();
    this.loadCategories();
    this.getAvailableCourses();
    this.getRegisteredCourses();
  }

  loadCourses(): void {
    this.courseservice.getCourses().subscribe(
      data => {
        if (data.length > 0) {
          this.courses = data;
          this.topCourse = this.getTopCourseWithHighestEnrollments() || {} as Course;
          if (this.categories.length > 0) {
            this.filterByCategory(this.categories[0]);
          }
        } else {
          this.message = "No Courses Available";
        }
      },
      error => {
        console.error("Error Fetching Courses", error);
      }
    );
  }

  getTopCourseWithHighestEnrollments(): Course | undefined {
    if (this.courses.length === 0) {
      return undefined;
    }
    return this.courses.reduce((topCourse, currentCourse) => {
      return (currentCourse.no_of_enrollments > topCourse.no_of_enrollments) 
        ? currentCourse 
        : topCourse;
    }, this.courses[0]);  
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe( 
      data => {
        if (data.length > 0) {
          this.categories = data.filter((category: Category) => category.no_of_courses > 0);
          if (this.categories.length > 0) {
            this.filterByCategory(this.categories[0]);
            this.activeCategory = this.categories[0].category_name;
          }
        } else {
          console.log("No categories available");
        }
      },
      error => {
        console.error("Error Fetching Categories", error);
      }
    );
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

  filterByCategory(category: Category): void {
    this.filteredCourses = this.courses.filter(course => course.course_category_name === category.category_name);
    this.activeCategory = category.category_name;
  }

  getRegisteredCourses(): void {
    this.courseservice.getUserRegisteredCourses().subscribe(
      data => {
        this.registeredCourses = data;
        this.topRegisteredCourses= this.getTopRegisterdCourses();
      },
      error => {
        console.error("Error fetching registered courses:", error.error.message);
      }
    );
  }

  getAvailableCourses(): void {
    this.courseservice.getAvailableCourses().subscribe(
      data => {
        this.availableCourses = data;
        this.topAvaliableCourses =this.getTopAvaliableCourses()
      },
      error => {
        console.error("Error fetching available courses:", error.error.message);
      }
    );
  }

  getTopRegisterdCourses(): Course[] {
    return this.registeredCourses
      // .filter(course => course.no_of_enrollments >= 1)
      .sort((a, b) => b.no_of_enrollments - a.no_of_enrollments)
      .slice(0, 3); 
  }
  getTopAvaliableCourses(): Course[] {
    return this.availableCourses
      // .filter(course => course.no_of_enrollments >= 1)
      .sort((a, b) => b.no_of_enrollments - a.no_of_enrollments)
      .slice(0, 3); 
  }
  openCourse(courseName:string){
    this.router.navigate([`student/courses/${courseName}`])
  }
  addwishlist(event:Event,courseName:string){
    event.stopPropagation()
    const icon=event.target as HTMLElement
    const status=icon.classList.contains('fa-solid')
    if(status){
      this.availableCourses.forEach(course=>{
        if(course.course_name==courseName){
          course.wishlist=false
        }
      })
      this.wishlistService.deleteCourseFromwhisList(courseName).subscribe(
        data=>console.log(data),
        error=>console.error(error.error.message)
      )
    }
    else{
      this.availableCourses.forEach(course=>{
        if(course.course_name==courseName){
          course.wishlist=true
        }
      })
      this.wishlistService.addCourseToWishList({"course_name":courseName}).subscribe(
        data=>console.log(data),
        error=>console.error(error.error.message)
      )
    }
    
  }
  getCoursePreview(courseName:string){
    console.log("clicks");
    
    this.router.navigate([`/student/coursepreview/${courseName}`])
  }
}

interface Category {
  category_name: string;
  no_of_courses: number;
}

export interface Course {
  course_category_name: string;   
  course_created_at: string;     
  course_description: string;     
  course_img: string;             
  course_instructor_name: string; 
  course_name: string;             
  course_price: string;         
  no_of_enrollments: number;      
  ratings: number;
  completion_percentage:number;
  wishlist:boolean;
}
