import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';
import { ScrollService } from 'src/app/services/scroll.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  standalone:false,
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  private scrollSubscription!:Subscription
  @ViewChild('footer') footer!:ElementRef;
  courses: Course[] = [];
  courses_imgs: string[] = [
    'https://png.pngtree.com/thumb_back/fh260/background/20230703/pngtree-d-rendered-image-of-black-mortarboard-hat-resting-on-opened-book-image_3737422.jpg',
    'https://img-b.udemycdn.com/notices/home_carousel_slide/image/12c0830f-aa27-4843-993d-b440aa389991.jpeg',
    'https://www.thinkific.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2022/06/online-learning-student.jpg.webp',
    'https://assets.openlearning.com/chunks_live/05cf79d1e48498c055a35ef6f3b22d29.png',
    'https://www.pluralsight.com/content/dam/pluralsight2/homepage/2023-updates/homepage-ai-hero-2.webp',
    'https://thumbor.forbes.com/thumbor/fit-in/1290x/https://www.forbes.com/advisor/wp-content/uploads/2022/07/learning_platform.jpeg.jpg',
  ];
  categories: Category[] = [];
  filteredCourses: Course[] = [];
  message: string | null = null;
  activeCategory:string|null=null

  constructor(
    private courseservice: CoursesService,
    private categorySevices: CategoryService,
    private router: Router,
    private element:ElementRef,
    private scrollservice:ScrollService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadCategories();
  }

  loadCourses(): void {
    this.courseservice.getCourses().subscribe(
      data => {
        
        if (data.length > 0) {
          this.courses = data;
          
          if (this.categories.length > 0) {
            this.filterByCategory(this.categories[0]);
          }
        } else {
          this.message = "No Courses Available";
        }
      },
      error => {
        console.error("Error Fetching Course", error);
      }
    );
  }

  loadCategories(): void {
    this.categorySevices.getCategories().subscribe(
      data => {
        if (data.length > 0) {
          this.categories = data.filter((category: Category) => category.no_of_courses > 0);
          if (this.categories.length > 0) {
            this.filterByCategory(this.categories[0]);
            this.activeCategory=this.categories[0].category_name
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
    this.activeCategory=category.category_name
  }

  ngAfterViewInit() {
    this.scrollSubscription = this.scrollservice.scrollToSection.subscribe((sectionId: any) => {
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
  getCoursePreview(courseName:string){
    console.log("clicks");
    
    this.router.navigate([`home/coursepreview/${courseName}`])
  }
  enroll(event:Event){
    event.stopPropagation()
    Swal.fire({
      title: 'Login Required',
      text: 'Please log in to enroll in this course.',
      icon: 'info', 
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.openLoginModal()
      }
    });
  }
  openLoginModal(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    const currentModalElement = document.querySelector('.modal.show');
    if (currentModalElement) {
      const currentModal = bootstrap.Modal.getInstance(currentModalElement);
      if (currentModal) {
        currentModal.hide();
      }
    }
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
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
}

interface Category {
  category_name: string;
  no_of_courses: number;
}
