import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-studentdetail',
  templateUrl: './studentdetail.component.html',
  standalone:false,
  styleUrls: ['./studentdetail.component.css']
})
export class StudentdetailComponent implements OnInit {
  user: User | undefined;
  enrollments: Enrollment[] = [];
  constructor(private userservice:UserService,private userDataService:UserDataService) { }

  ngOnInit(): void {
    const user_email =this.userDataService.currentEmail();
    if (user_email) {
      this.getUserDetails(user_email);
    }
  }
  getUserDetails(user_email:string){
    this.userservice.getUserByEmail(user_email).subscribe(
      (data: UserEnrollmentResponse) => {
        this.user = data.user;
        this.enrollments = data.enrollments;
      },
      error=>{
        console.log(error.error.message)
      }
    )
  }
}
export interface Enrollment {
  amount: string;
  course_category: string; 
  course_name: string;
  enrolle_date: string; 
  payment_at: string; 
  payment_id: string; 
  payment_mode: string;
  user_email: string; 
  user_name: string; 
}

export interface User {
  no_of_enrollments: number;
  user_address: string; 
  user_created_at: string; 
  user_email: string; 
  user_name: string; 
  user_phone_number: string; 
  user_role: string;
  user_updated_at: string;
}
export interface UserEnrollmentResponse {
  enrollments: Enrollment[]; 
  user: User; 
}