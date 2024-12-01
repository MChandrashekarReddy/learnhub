import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CoursesService } from 'src/app/services/courses.service';
import { Location } from '@angular/common';
import { EnrollmentsService } from 'src/app/services/enrollments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-enrollment',
  templateUrl: './course-enrollment.component.html',
  standalone:false,
  styleUrls: ['./course-enrollment.component.css']
})
export class CourseEnrollmentComponent implements OnInit, OnDestroy {
  courseName!: string;
  course!: Course
  paymentOptions: string[] = ['DebitCard', 'CreditCard', 'UPI', 'NetBanking']
  selectedOption: string |null= null
  countDown = 120
  minutes = 2
  seconds = 0
  countDownSubscription!: Subscription
  cardForm!: FormGroup
  bankForm!:FormGroup
  upiForm!:FormGroup
  constructor(private activatedRoute: ActivatedRoute, private enrollmentService:EnrollmentsService,private courseService: CoursesService, private location: Location, private fb: FormBuilder) {
    this.cardForm=this.fb.group({
      cardNumber: ['',[Validators.required,Validators.minLength(16),Validators.maxLength(16),Validators.pattern('^[0-9]*$')]],
      expiryDate: ['',[Validators.required,this.expirationDateValidator,Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern('^[0-9]*$')]],
      cardholderName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(500), Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]]
    })
    this.bankForm=this.fb.group({
      bankName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(100),Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]]
    })
    this.upiForm=this.fb.group({
      upiid:['',[Validators.required,Validators.minLength(12),Validators.maxLength(20),Validators.pattern('^[a-zA-Z0-9._]+@[a-zA-Z]{2,}$')]]
    })
  }
  expirationDateValidator(control: FormControl) {
    const today = new Date();
    const currentYear=today.getFullYear()%100
    const [month, year] = control.value.split('/').map((x: string) => parseInt(x, 10));;
    if (year <currentYear || (year === currentYear && month < today.getMonth() + 1)) {
      return { expired: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.startCountDown()
    this.courseName = this.activatedRoute.snapshot.params['name']
    this.courseService.getCourseByName(this.courseName).subscribe(
      data => {
        this.course = data.course
      }
    )
  }
  selectPaymentOption(event: Event) {
    const option = event.target as HTMLOptionElement
    this.selectedOption = option.value
  }
  startCountDown() {
    this.countDownSubscription = interval(1000).subscribe(() => {
      this.countDown--;
      this.minutes = Math.floor(this.countDown / 60);
      this.seconds = this.countDown % 60;
      if (this.countDown <= 0) {
        this.countDownSubscription.unsubscribe()
        Swal.fire({
          title: 'Time Exceeded',
          text: 'The payment session has expired. Please start again if needed.',
          icon: 'warning',
          confirmButtonText: 'OK'
      })
       this.location.back()
      }
    });
  }
  ngOnDestroy(): void {
    if (this.countDownSubscription) {
      this.countDownSubscription.unsubscribe()
    }
  }
  pay(){
    if(!this.disbaleStatus()){
      Swal.fire({
        title: 'Processing payment...',
        text: 'Please wait while we complete your transaction.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
      const paymentData={'course_name':this.courseName,"payment_mode":this.selectedOption}
      this.enrollmentService.addEnrollement(paymentData).subscribe(
        data=>{
          Swal.close()
          Swal.fire({
            title: 'Payment Successful!',
            html: `
                <div style="text-align: center; margin-top: 10px;">
                    <p style="margin-bottom: 8px;"><strong>Status:</strong> ${data.payment_status}</p>
                    <p style="margin-bottom: 8px;"><strong>Payment ID:</strong> ${data.payment_id}</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        this.location.back()
        },
        error=>{
          Swal.fire({
            title: 'Payment Failed',
            text: 'There was an issue processing your payment. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          
        }
      )
    }
    else{
      Swal.fire({
        title: 'Selection Required',
        text: 'Please choose an option and continue with the payment.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      
    }
  }
  disbaleStatus():boolean{
    if(this.selectedOption==null){
      return true
    }
    if(this.selectedOption==this.paymentOptions[0]||this.selectedOption==this.paymentOptions[1]){
      return this.cardForm.invalid
    }
    else  if(this.selectedOption==this.paymentOptions[2]){
      return this.upiForm.invalid
    }
    else if(this.selectedOption==this.paymentOptions[3]){
      return this.bankForm.invalid
    }
    return true
  }
  close(){
    this.location.back()
  }
}
interface Course {
  course_name: string,
  course_price: string
}
