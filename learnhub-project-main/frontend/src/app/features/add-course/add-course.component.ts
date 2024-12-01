import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { CategoryService } from 'src/app/services/category.service';
import { CoursesService } from 'src/app/services/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  standalone:false,
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm!:FormGroup
  errorMessage: string | null = null;
  categories:string[]=[]
  constructor(private router:Router,private categoryService:CategoryService,private courseServise:CoursesService,private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      course_name: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      course_img: ['', [Validators.required]],
      course_price: ['', [Validators.required, Validators.min(1)]],
      course_description: ['', [Validators.required,Validators.maxLength(1000)]],
      category: ["", [Validators.required]]
    });}

  ngOnInit(): void {
    this.getAllCategories()
  }
  getAllCategories(){
    this.categoryService.getCategories().subscribe(
      data=>{
        this.categories=data.map((category:any)=>{
          return category.category_name
        });;
      },
      error=>{
        console.log(error.error.message)
      }
    )
  }
  close() {
   
  }
  onSubmit(){
    this.courseServise.addCourse(this.courseForm.value).subscribe(
      data=>{
        Swal.fire({
          icon: 'success',
          title: 'Course Added Successfully!',
          text: 'The course has been successfully added to the system.',
          confirmButtonText: 'OK',
        });
        const content=document.querySelector('.modal-open') as HTMLElement;
        const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
        if (content) {
          content.style.overflow = 'scroll'; 
        }
        if (backdrop) {
          backdrop.remove(); 
        }
        this.courseForm.reset()
        this.router.navigate(['./'])
      },
      error=>{
        Swal.fire({
          icon: 'error', 
          title: 'Error',
          text: 'Could not add the course. Please try again later.',
          confirmButtonText: 'OK',
        });
        console.log(error.error.message)
        this.errorMessage=error.error.message
      }
    )
  }
}
