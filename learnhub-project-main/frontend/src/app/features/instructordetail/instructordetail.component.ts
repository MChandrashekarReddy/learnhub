import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructordetail.component.html',
  standalone:false,
  styleUrls: ['./instructordetail.component.css']
})
export class InstructorDeatilComponent implements OnInit {
  courses:Course[]=[]
  user: User | undefined;
  instructorEmail:string=''
  constructor(private userdataservice:UserDataService,private userservice:UserService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.getInstructorDetails(this.userdataservice.currentEmail())
  }
  getInstructorDetails(user_email:string){
    this.userservice.getUserByEmail(user_email).subscribe(
      (data:InstructorDetails)=>{
        console.log(data);
        (data)
        this.user = data.user;
        this.courses = data.courses;
      },
      error=>{
        console.log(error.error.message);
        
      }
    )

  }
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
}
export interface User {
  no_of_courses: number;
  user_address: string;
  user_created_at: string;
  user_email: string;
  user_name: string;
  user_phone_number: string;
  user_role: string;
  user_updated_at: string;
}
export interface InstructorDetails {
  courses: Course[];
  user: User;
}
