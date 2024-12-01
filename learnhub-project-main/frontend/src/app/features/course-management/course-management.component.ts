import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  standalone:false,
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  categories: Category[] = [];
  filteredCourses: Course[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  searchCourse: string = '';
  selectedCategories: string[] = []; 

  constructor(private courseService: CoursesService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getAllCourses();
    this.getAllCategories(); 
  }

  getAllCourses() {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data.map((item: any) => ({
          course_category_name: item.course_category_name,
          course_created_at: item.course_created_at,
          course_instructor_name: item.course_instructor_name,
          course_name: item.course_name,
          course_price: Number(item.course_price),
          no_of_enrollments: item.no_of_enrollments,
          ratings: item.ratings,
          revenue: item.no_of_enrollments * Number(item.course_price),
        }));
        this.filteredCourses = [...this.courses]; 
        this.updateDisplayedCourses();
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  getAllCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  onCategory(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.filterCoursesByCategory();
  }

  filterCoursesByCategory() {
    if (this.selectedCategories.length === 0) {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter(
        course => this.selectedCategories.includes(course.course_category_name)
      );
    }
    this.pageIndex = 0; 
    this.updateDisplayedCourses();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedCourses();
  }

  updateDisplayedCourses() {
    const startIndex = this.pageIndex * this.pageSize;
    this.filteredCourses = this.filteredCourses.slice(startIndex, startIndex + this.pageSize);
  }

  sortBy(event: Event): void {
    const target = event.target as HTMLSelectElement | null; 
    if (target) {
      const property = target.value as keyof Course; 
      const coursesToSort: Course[] = [...this.filteredCourses]; 
      coursesToSort.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
        return 0;
      });

      this.filteredCourses = coursesToSort;
      this.updateDisplayedCourses(); 
    }
  }

  get filteredCourseByName() {
    return this.courses.filter(course =>
      course.course_name.toLowerCase().includes(this.searchCourse.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.filteredCourses = this.filteredCourseByName; 
    this.updateDisplayedCourses(); 
  }
  
}

export interface Course {
  course_category_name: string;
  course_created_at: string;
  course_instructor_name: string;
  course_name: string;
  course_price: number;
  no_of_enrollments: number;
  ratings: number;
  revenue: number;
}

interface Category {
  category_name: string;
  no_of_courses: number;
}
