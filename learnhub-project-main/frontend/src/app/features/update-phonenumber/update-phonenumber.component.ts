import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { error } from 'console';
import { interval, Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { UpdateService } from 'src/app/services/update.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { After } from 'v8';

@Component({
  selector: 'app-update-phonenumber',
  templateUrl: './update-phonenumber.component.html',
  standalone:false,
  styleUrls: ['./update-phonenumber.component.css']
})
export class UpdatePhonenumberComponent implements OnInit {
  errorMessage:string|null=null
  stages:string[]=['confirmation','pending','submition']
  stage:string=this.stages[0]
  countdown: number = 300;
  minutes: number = 5;
  seconds: number = 0;
  otp=['','','',''];
  emailResponse=''
  private countdownSubscription!: Subscription;
  newPhoneNumberForm!:FormGroup
  constructor(private fb:FormBuilder,private emailService:EmailService,private userService:UserService,private updateService:UpdateService) {
    this.newPhoneNumberForm=this.fb.group({
      new_phone_number:['',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^[6789]\d{9}$/
)]]
    })
   }

  ngOnInit(): void {
  }
  

  sendOTP(){
    this.stage=this.stages[1]
    this.emailService.updatePhoneNumberEmail().subscribe(
      data=>{
        this.stage=this.stages[2]
        this.emailResponse=data
        this.startCountdown()
      },
      error=>{
        this.errorMessage=error.error.message
        this.stage=this.stages[0]
      }
    )
    
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    
    const inputElement = event.target as HTMLInputElement;
    
    if (event.key === 'Backspace' && inputElement.value.length === 0 && index > -1) {
      this.otp[index - 1] = '';
      this.errorMessage = null;
      (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement).focus();
    }
  }
  handleInput(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    this.otp[index] = inputElement.value
    if (inputElement.value.length === 1 && index < this.otp.length - 1) {
      this.errorMessage = null;
      (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement).focus();
    }
  }
  startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      this.minutes = Math.floor(this.countdown / 60);
      this.seconds = this.countdown % 60;
      if (this.countdown <= 0) {
        this.stopCountdown();
      }
    });
  }
  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
  isValidOTP():boolean{
    if(this.otp.join('').length!=4)return false
    const status = this.otp.every(digit => /^\d$/.test(digit));
    return status;
  }
  
  submit(){
    if(this.newPhoneNumberForm.valid&&this.isValidOTP()){
      const enteredOTP=this.otp.join('')
      const phoneNumberObj={"new_phone_number":this.newPhoneNumberForm.value.new_phone_number+'',"otp":enteredOTP}
      this.userService.updatePhoneNumber(phoneNumberObj).subscribe(
        data=>{
          this.close()
          this.updateService.updateProfile(true)
          Swal.fire({
            title: `${data}`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
          
        },
        error=>{
          this.errorMessage=error.error.message
          this.stage=this.stages[2]
        }
      )
    }
    else if(!this.isValidOTP()){
      this.errorMessage="InValid OTP"
    }
    else{
      this.errorMessage="Invalid Phone Number"
    }
    this.stage=this.stages[2]
    
  }
  close() {
    this.stage = this.stages[0];
    this.countdown = 300;
    this.stopCountdown();
    this.otp = ['', '', '', ''];
    this.errorMessage=null
    const closeButton = document.getElementById("closeUpdatePhoneNumber") as HTMLButtonElement;
    if (closeButton) {
        closeButton.click();  
        
    } 
}

}
