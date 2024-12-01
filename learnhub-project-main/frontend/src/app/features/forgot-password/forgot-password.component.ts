import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { error } from 'console';
import { interval, Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone:false,
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  errorMessage: string | null = null;
  otpGeneration: boolean = false
  progress: boolean = false
  forgotPasswordForm!: FormGroup;
  newpasswordForm!: FormGroup;
  passWordField = 'password';
  passwordIcon: string = 'fa-solid fa-eye'
  confirmpassWordField = 'password';
  confirmpasswordIcon: string = 'fa-solid fa-eye'
  password: string = '';
  confirmpassword: string = '';
  otp: string[] = ['', '', '', ''];
  countdown: number = 300;
  minutes: number = 5;
  seconds: number = 0;
  private countdownSubscription!: Subscription;
  constructor(private fb: FormBuilder, private emailService: EmailService, private userService: UserService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)]]
    })
    this.newpasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmpassword: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
  }
  passwordVisibility(event: Event) {
    event.stopPropagation()
    this.passWordField = (this.passWordField === 'password') ? 'text' : 'password'
    this.passwordIcon = (this.passwordIcon == 'fa-solid fa-eye') ? 'fa solid fa-eye-slash' : 'fa-solid fa-eye'
  }

  confirmpasswordVisibility(event: Event) {
    event.stopPropagation()
    this.confirmpassWordField = (this.confirmpassWordField === 'password') ? 'text' : 'password'
    this.confirmpasswordIcon = (this.confirmpasswordIcon == 'fa-solid fa-eye') ? 'fa solid fa-eye-slash' : 'fa-solid fa-eye'
  }
  isMatching() {
    return (this.password === this.confirmpassword)
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
  getOTP() {
    this.otp = ['', '', '', '']
    if (this.forgotPasswordForm.valid) {
      this.progress = true
      this.otpGeneration = false
      const email = this.forgotPasswordForm.value.email
      this.generateOTP(email)
    }
    else {
      this.errorMessage = "Invalid Email"
    }
  }
  generateOTP(email: string) {
    this.emailService.resetPassword(email).subscribe(
      data => {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent Successfully',
          text: 'Check your inbox for the OTP.',
          confirmButtonText: 'OK'
        });
        this.countdown = 300
        this.startCountdown()
        this.otpGeneration = true
        this.progress = false
      },
      error => {
        this.otpGeneration = false
        this.progress = false
        this.errorMessage = error.error.message
      }
    )
  }
  changePassword() {
    this.progress=true
    this.otpGeneration=false
    const status = this.otp.map(digit => parseInt(digit, 10)).some(digit => digit <= 9 || digit >= 0);
    const enteredOTP = this.otp.join('');
    if(status&&this.newpasswordForm.valid&&this.forgotPasswordForm.valid){
      const user={"email":this.forgotPasswordForm.value.email,"password":this.newpasswordForm.value.password,"confirmpassword":this.newpasswordForm.value.confirmpassword,"otp":enteredOTP}
   
    this.userService.forgotPassword(user).subscribe(
      data => {
        this.countdown = 300
        this.otp = ['', '', '', '']
        this.forgotPasswordForm.reset()
        this.newpasswordForm.reset()
        this.progress = false
        this.otpGeneration = false
        alert(data)
        this.close()
        this.openLoginModal()

      },
      error => {
        this.otp = ['', '', '', '']
        this.progress = false
        this.otpGeneration = true
        this.errorMessage = error.error.message
      }
    )
    }
    else{
      this.errorMessage="Invalid Details"
    }
  }
  backToLogin() {
    this.countdown = 300
    this.otp = ['', '', '', '']
    this.forgotPasswordForm.reset()
    this.newpasswordForm.reset()
    this.errorMessage = null;
    this.otpGeneration = false
    this.progress = false
    this.stopCountdown()
  }
  close() {
    this.countdown = 300
    this.otp = ['', '', '', '']
    this.forgotPasswordForm.reset()
    this.newpasswordForm.reset()
    this.errorMessage = null;
    this.otpGeneration = false
    this.progress = false
    this.stopCountdown()
    const content = document.querySelector('.modal-open') as HTMLElement;
    const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
    if (backdrop) {
      backdrop.remove();
    }
    if (content) {
      content.style.overflow = 'scroll';
    }

  }
  openLoginModal(event?: MouseEvent) {
    this.otpGeneration = false
    this.progress = false
    if (event) {
      event.preventDefault();
    }
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

}


