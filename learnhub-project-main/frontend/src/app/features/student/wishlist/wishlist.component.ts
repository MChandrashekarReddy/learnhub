import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { data } from 'jquery';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone:false,
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  courses:Course[]=[]
  errMessage:string=''
  constructor(private wishlistService:WishlistService) { }

  ngOnInit(): void {
    this.getWishlist()
  }
  getWishlist(){
    this.wishlistService.getWishList().subscribe
    (
      data=>this.courses=data,
      error=>this.errMessage=error.error.message
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
      stars.push('fa-regular fa-star'); 
    }
    return stars;
  }
  remove(courseName:string){
    this.wishlistService.deleteCourseFromwhisList(courseName).subscribe()
    this.courses = this.courses.filter(course => course.course_name !== courseName);
  }
}
 interface Course {
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
