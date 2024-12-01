import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { error } from 'console';
import { interval, Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { UpdateService } from 'src/app/services/update.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-updateemail',
  templateUrl: './updateemail.component.html',
  standalone:false,
  styleUrls: ['./updateemail.component.css']
})
export class UpdateemailComponent implements OnInit{
  errorMessage:string|null=null
  stages = ['request','OTPValidation','newEmailAddition','newEmailVerification','progress'];
  stage:string=this.stages[0]
  countdown: number = 300;
  minutes: number = 5;
  seconds: number = 0;
  otp=['','','',''];
  private countdownSubscription!: Subscription;
  emailResponse=''
  newEmailForm!:FormGroup
  constructor(private emailService:EmailService,private fb:FormBuilder,private userService:UserService,private updateService:UpdateService){
    this.newEmailForm=this.fb.group({
      new_email:['',[Validators.required,Validators.maxLength(500),Validators.minLength(7),Validators.pattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`),Validators.email]],
      confirm_email:['',[Validators.required,Validators.maxLength(500),Validators.minLength(7),Validators.pattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`),Validators.email]]
    })
  }
  ngOnInit(): void {
    
  }

  confirm(){
    this.stage=this.stages[4]
    this.sendOTPToPresentEmail();
  }
 
  sendOTPToPresentEmail(){
    this.emailService.sendOTPForEmailUpdate().subscribe(
      data=>{
        this.emailResponse=data
        this.stage=this.stages[1];
        this.startCountdown()
      },
      error=>{
        this.errorMessage=error.error.message
        this.stage=this.stages[0]
      }
    )
  }
  resend(){
    if(this.stage==this.stages[1]){
      this.sendOTPToPresentEmail()
    }
    if(this.stage==this.stages[3]){
      this.verifyEmail()
    }
    this.stage=this.stages[4]
    this.resetTime()
  }
  resetTime(){
    this.countdown = 300;
    this.minutes = 5;
    this.seconds = 0;
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
    const status = this.otp.map(digit => parseInt(digit, 10)).some(digit => digit <= 9 || digit >= 0) && this.otp.join('').length==4;
    return status
  }
  verifyOTP():void{
    if(this.stage==this.stages[1]){
      this.stage=this.stages[4]
      if(this.isValidOTP()){
        const enteredOTP=this.otp.join('')
        this.emailService.requestForOTPUpdation({'otp':enteredOTP}).subscribe(
          data=>{
            this.resetTime()
            this.otp=['','','','']
            this.stage=this.stages[2]
          },
          error=>{
            this.stage=this.stages[1]
            this.otp=['','','','']
            this.errorMessage=error.error.message
          }
        )
      }
    }
  }
  verifyEmail(){
    if(this.newEmailForm.valid){
      this.stage=this.stages[4]
      const emailObj=this.newEmailForm.value
      this.emailService.verifyNewEmail(emailObj).subscribe(
        data=>{
          this.stage=this.stages[3]
          this.emailResponse=data.message
        },
        error=>{
          this.stage=this.stages[2]
          this.errorMessage=error.error.message
        }
      )
    }
    else{
      this.errorMessage="Invalid"
    }
  }
  isMatching(){
    return this.newEmailForm.value.new_email==this.newEmailForm.value.confirm_email
  }
  updateEmail(){
    if(this.newEmailForm.valid&&this.isValidOTP()){
      const enteredOTP=this.otp.join('')
      const email={
        "new_email":this.newEmailForm.value.new_email,
        "confirm_email":this.newEmailForm.value.confirm_email,
        "otp":enteredOTP
      }
      this.userService.updateEmail(email).subscribe(
        data=>{
          alert(data)
          this.close()
          this.updateService.updateProfile(true)
        },
        error=>{
          this.errorMessage=error.error.message
          this.stage=this.stages[2]
          this.otp=['','','','']
        }
      )
    }
      
  }
  close() {
    this.stage=this.stages[0]
    this.countdown=300
    this.stopCountdown()
    this.otp=['','','','']
    this.errorMessage=null
    const closeButton=document.getElementById("closeUpdateEmail") as HTMLButtonElement
    if(closeButton){
    closeButton.click()
    }
  }
}
