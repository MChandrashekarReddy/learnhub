import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { ContentsService } from 'src/app/services/contents.service';
import { CoursesService } from 'src/app/services/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  standalone:false,
  styleUrls: ['./edit-content.component.css']
})
export class EditContentComponent implements OnInit {
  courseName!:string
  contents:Content[]=[]
  courseOverview!:CourseOverview
  courseOverviewForm!:FormGroup
  course_img=""
  mode:string="Edit"
  constructor(private fb:FormBuilder,private contenService:ContentsService,private courseService:CoursesService,private activatedRoute:ActivatedRoute) {
    this.courseOverviewForm=this.fb.group({
      course_name: ['',],
      course_img: ['', [Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/)]], 
      course_price: ['', [Validators.min(1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],  
      course_description: ['', [Validators.maxLength(1000)]],
    })
   }

  ngOnInit(): void {
    this.courseName = this.activatedRoute.snapshot.params['name'];
    this.getContent(this.courseName)
    this.getOverview(this.courseName)
    this.courseOverviewForm.get('course_img')?.setValue(this.courseOverview.course_img);
 }
  getContent(courseName:string){
    this.contenService.getContent(courseName).subscribe(
      data=>this.contents=data,
      error=>console.error(error.error.message)
    )
  }
  getOverview(courseName:string){
    this.courseService.getOverview(courseName).subscribe(
      data=>{
        this.courseOverview=data
        this.course_img=data.course_img
        this.courseOverviewForm.patchValue({
          course_name:this.courseName,
          course_img: this.courseOverview.course_img,
          course_price: this.courseOverview.price,
          course_description: this.courseOverview.course_description
        })
      },
      error=>console.error(error.error.message)
    )
  }
  triggerFileInput(){
    const input = document.createElement("input");
    input.type='file'
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        console.log(file.name);
        
        this.courseOverviewForm.patchValue({
          course_img: `../../../assets/${file.name}`
        });
      }
    });
    input.click()
  }
 submitCourse(){
  if(this.mode==="Save"){
    console.log(this.courseOverviewForm.value);
    
   this.courseService.updateCourse(this.courseOverviewForm.value).subscribe(
    data=>{
      Swal.fire({
        icon: 'success',
        title: 'Course Updated Successfully!',
        text: 'The course has been successfully updated.',
        confirmButtonText: 'OK',
      });
      this.mode="Edit"
    },
    error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops! Something went wrong.',
        text: 'There was an issue updating the course. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
   )
  }
  else{
    this.mode="Save"
  }
 }

}
interface Content{
  content_assignment:string|null,
  content_name:string,
  content_notes:string,
  content_quiz: string|null,
  content_video:string
}
interface CourseOverview{
  course_name: string,
  course_description: string,
  course_img: string,
  price:string
}