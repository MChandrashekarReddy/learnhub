import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ContentsService } from 'src/app/services/contents.service';
import { CoursesService } from 'src/app/services/courses.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-preview',
  templateUrl: './course-preview.component.html',
  standalone:false,
  styleUrls: ['./course-preview.component.css']
})
export class CoursePreviewComponent implements OnInit {
  courseName!:string
  courseOverview!:CourseOverview
  courseReviews!:CourseReviews
  contents:Content[]=[]
  isUserLoggedIn:boolean=false
  isReviewsAvaliable:boolean=true
  isContentAvaliable:boolean=true
  selectedVideoPath: string | null = null;
  constructor(private activatedRoute:ActivatedRoute,private courseService:CoursesService,private contentService:ContentsService,private reviewService:ReviewsService,private router:Router) { }

  ngOnInit(): void {
    this.courseName=this.activatedRoute.snapshot.params['name']
    if(this.courseName){
      this.getCourseOverView(this.courseName)
      this.getReviews(this.courseName)
      this.getContents(this.courseName)
    }
    if (localStorage.getItem('token')){
      this.isUserLoggedIn=true;
    }
  }
  getCourseOverView(courseName:string){
    this.courseService.getOverview(courseName).subscribe(
      data=>this.courseOverview=data,
      error=>console.error(error.error.message)
    )
  }
  getReviews(courseName:string){
    this.reviewService.getReviews(courseName).subscribe(
      data=>{
        this.courseReviews=data
      },
      error=>{
        console.log(error)
        this.isReviewsAvaliable=false
      }
    )
  }
  getContents(courseName:string){
    this.contentService.getOverViewContent(courseName).subscribe(
      data=>this.contents=data,
      error=>{
        console.error(error.error.message)
        this.isContentAvaliable=false
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
      stars.push('far fa-star'); 
    }
    return stars;
  }
  onDownload(event:Event,file: string,fileName:string) {
    event.stopPropagation();
    const download=event.target as HTMLElement;
    const downloading=download.nextElementSibling as HTMLElement
    const downloaded=downloading.nextElementSibling as HTMLElement
    console.log(downloading);
    console.log(downloaded);
    download.style.display='none';
    downloading.style.display='block'
    const a = document.createElement("a");
    a.href = file;
    a.download = `${fileName}.pdf`; 
    document.body.appendChild(a);
    a.click(); 
    document.body.removeChild(a);
    setTimeout(()=>{
      downloading.style.display='none'
      downloaded.style.display='block'
    },3000)
    setTimeout(() => {
      downloaded.style.display='none'
      download.style.display='block'
    }, 5000);
  }
  openCardBody(event:Event){
    if(event.target){
      event.preventDefault()
      const parentElement = event.target as HTMLElement;
      const childElement=parentElement.lastChild as HTMLElement;
      childElement.style.transition = 'transform 0.05s linear';
      childElement.style.transform = childElement.style.transform === 'rotate(-90deg)' ? 'rotate(0deg)' : 'rotate(-90deg)';
      const targetElemnt=parentElement.nextElementSibling as HTMLElement;
      targetElemnt.style.display = targetElemnt.style.display === 'none' ? 'flex' : 'none';
    }
  }

  enroll(){
    if(this.isUserLoggedIn){
      this.router.navigate([`student/enroll/${this.courseName}`])
    }
    else{
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
    
  }
  openLoginModal() {
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
 
  openVideoModal(videoPath: string): void {
    this.selectedVideoPath = videoPath;
  }

  closeVideoModal(): void {
    this.selectedVideoPath = null;
  }
}
interface CourseOverview {
  avg_rating: number;
  course_description: string;
  course_img: string;
  course_name: string;
  no_of_enrollments: number;
  no_of_lessons: number;
  no_of_reviews: number;
  total_duration:string;
  category:string;
  created_at?:Date;
}
interface Review {
  rating: number;
  review_at: string;
  review_content: string;
  user_img: string | null;
  user_name: string;
}
interface CourseReviews {
  average_rating: number;
  five_star_ratings: number;
  four_star_ratings: number;
  one_star_ratings: number;
  three_star_ratings: number;
  two_star_ratings: number;
  one_star_ratings_per:number;
  two_star_ratings_per:number;
  three_star_ratings_per:number;
  four_star_ratings_per:number;
  five_star_ratings_per:number;
  reviews: Review[];
}
interface Content{
  content_assignment_path:string|null;
  content_doc_path:string|null;
  content_name: string;
  content_quiz_path: string|null;
  content_video_path: string|null;
}

