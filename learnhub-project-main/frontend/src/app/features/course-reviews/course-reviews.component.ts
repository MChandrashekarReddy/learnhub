import { compileInjectable } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { DiscussionsService } from 'src/app/services/discussions.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-course-reviews',
  templateUrl: './course-reviews.component.html',
  standalone:false,
  styleUrls: ['./course-reviews.component.css']
})
export class CourseReviewsComponent implements OnInit {
  courseName:string=''
  courseReviews!:CourseReviews
  isReviewsAvailable:boolean=true
  constructor(private reviewService:ReviewsService,private sharedService:SearchService,private router:Router) { }
  isStudent:boolean=false;
  feedback:string=''
  rating: number = 0;
  ngOnInit(): void {
    this.sharedService.currentCourse.subscribe(courseName=>this.courseName=courseName)
    this.getReviews(this.courseName)
    this.isStudent=this.router.url.startsWith("/student");
    
  }
  getReviews(courseName:string){
    this.reviewService.getReviews(courseName).subscribe(
      data=>{
        this.courseReviews=data
        this.isReviewsAvailable=true
      },
      error=>{
        if(error.status==404){
          this.isReviewsAvailable=false
        }
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
  setRating(star: number) {
    this.rating = star;
  }
  submitReview() {
    if (this.feedback && this.rating > 0) {
      console.log('Review submitted:', this.feedback, 'Rating:', this.rating);
      this.reviewService.addReview(this.courseName,{"review_content":this.feedback,"review_rating":this.rating}).subscribe(
        data=>{
          this.getReviews(this.courseName)
          alert("successfully your review got submitted")
          this.rating=0
          this.feedback=''
        },
        error=>console.error(error.error.message) 
      )
     
    } else {
      alert('Please provide feedback and a rating.');
    }
  }
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