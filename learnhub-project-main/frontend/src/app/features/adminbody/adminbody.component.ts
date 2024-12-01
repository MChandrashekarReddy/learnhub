import { Component, OnInit } from '@angular/core';
import { error } from 'jquery';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';
import { EnrollmentsService } from 'src/app/services/enrollments.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-adminbody',
  templateUrl: './adminbody.component.html',
  standalone:false,
  styleUrls: ['./adminbody.component.css']
})
export class AdminbodyComponent implements OnInit {
  enrollments: number = 0;
  revenue: number = 0;
  totalusers: number = 0;
  totalStudents: number = 0;
  totalInstructors: number = 0;
  activeStudents: number = 0;
  activeInstructors: number = 0;
  inactiveStudents: number = 0;
  inactiveInstructors: number = 0;
  courses: number = 0;
  categories: { [key: string]: number } = {};
  categoriesRevenue: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private coursesService: CoursesService,
    private enrollmentsservice: EnrollmentsService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getTotalStudents();
    this.getTotalCourses();
    this.getTotalEnrollments();
    this.getCategories();
  }

  getTotalStudents() {
    this.userService.getTotalUsers().subscribe(
      data => {
        this.activeInstructors = data.activeInstructors;
        this.activeStudents = data.activeStudents;
        this.inactiveInstructors = data.inactiveInstructors;
        this.inactiveStudents = data.inactiveStudents;
        this.totalInstructors = data.totalInstructors;
        this.totalStudents = data.totalStudents;
        this.totalusers = this.totalInstructors + this.totalStudents;
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  getTotalCourses() {
    this.coursesService.getTotalNumberOfCourses().subscribe(
      data => {
        this.courses = Number(data);
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  getTotalEnrollments() {
    this.enrollmentsservice.getTotalEnrollments().subscribe(
      data => {
        this.enrollments = Number(data.enrollments);
        this.revenue = Number(data.revenue);
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  getCategories() {
    this.categoryService.getTotalCategories().subscribe(
      data => {
        this.categories = data.categories;
        this.categoriesRevenue = data.categories_revenue;
      },
      error => {
        console.log(error);
      }
    );
  }
 
  

}
