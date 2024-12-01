import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { log } from 'console';
import { data, error } from 'jquery';
import { interval, Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone:false,
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passWordField = 'password';
  passwordIcon: string = 'fa-solid fa-eye'
  confirmpassWordField = 'password';
  confirmpasswordIcon: string = 'fa-solid fa-eye'
  password: string = '';
  confirmpassword: string = '';
  errorMessage: string | null = null;
  otpGeneration: boolean = false
  // progress: boolean = false
  otp: string[] = ['', '', '', ''];
  timmer: string = '0'
  email: string = "mc@gmail.com"
  countdown: number = 300;
  minutes: number = 5;
  seconds: number = 0;
  private countdownSubscription!: Subscription;
  constructor(private formBuilder: FormBuilder, private emailService: EmailService, private router: Router, private userservice: UserService) {
    this.signupForm = this.formBuilder.group({
      img: ['', [Validators.minLength(2), Validators.maxLength(500), Validators.pattern(/\.(jpg|jpeg|png|gif)$/i)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$`)]],
      phonenumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[1-9][0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmpassword: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      role: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.stopCountdown();
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
  signupSubmit() {
    // this.progress = true
    const swalInstance=this.proccessing()
    // this.otpGeneration=false
    this.countdown=300
    if (this.signupForm.valid) {
      this.email = this.signupForm.value.email
      this.emailService.generateOTP({ "email": this.email, "name": this.signupForm.value.name }).subscribe(
        data => {
          swalInstance.close()
          this.startCountdown()
          this.otpGeneration = true
          // this.progress = false
        },
        error => {
          swalInstance.close()
          Swal.fire({
            icon: 'error',
            title: 'Account Creation Failed',
            text: `${error.error.message}`,
            confirmButtonText: 'Retry'
        });
          this.errorMessage = error.error.message
          // this.progress=false
          this.otpGeneration=false
        }
      )
    }
    else {
      this.errorMessage = "Invalid Details"
    }
  }
  close() {
    const content=document.querySelector('.modal-open') as HTMLElement;
    const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
    if (backdrop) {
        backdrop.remove(); 
    }
    if (content) {
        content.style.overflow = 'scroll'; 
    }
    
  }
  openLoginModal(event?: MouseEvent) {
    this.otpGeneration=false
    // this.progress=false
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

  isMatching() {
    return (this.password === this.confirmpassword)
  }
  verifyOTP() {
    const swalInstance=this.proccessing()
    const status = this.otp.map(digit => parseInt(digit, 10)).some(digit => digit <= 9 || digit >= 0);
    const enteredOTP = this.otp.join('');
    if (status && enteredOTP.length == 4) {
      let user: User = {
        user_name: this.signupForm.value.name,
        user_email: this.signupForm.value.email,
        user_phone_number: (this.signupForm.value.phonenumber) + "",
        user_password: this.signupForm.value.password,
        user_address: this.signupForm.value.address,
        user_role: this.signupForm.value.role,
        otp: enteredOTP
      }
      const imgValue = this.signupForm.get('img')?.value;
      if (imgValue) {
        user.user_img = '../../../assets/' + imgValue.slice(12);
      }
      this.userservice.signup(user).subscribe(
        data => {
          swalInstance.close()
          Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'Your account has been successfully created!',
            confirmButtonText: 'Ok'
          });
          
          this.close()
          this.openLoginModal()
        },
        error => {
          swalInstance.close()
          Swal.fire({
            icon: 'error',
            title: 'Account Creation Failed',
            text: `${error.error.message}`,
            confirmButtonText: 'Ok'
        });
          this.errorMessage=error.error.message
          this.otp=['','','','']
        }
      )
    }
    else {
      this.errorMessage = "InValid OTP"
      
    }
  }
  handleKeyDown(event: KeyboardEvent, index: number) {
    const inputElement = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && inputElement.value.length === 0 && index > -1) {
      this.otp[index - 1] = '';
      this.errorMessage=null;
      (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement).focus();
    }
  }
  handleInput(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    this.otp[index] = inputElement.value
    if (inputElement.value.length === 1 && index < this.otp.length - 1) {
      this.errorMessage=null;
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
  backToSignIn() {
    this.errorMessage=null;
    this.otpGeneration = false
    this.stopCountdown()
    this.countdown = 300;
  }
  proccessing(){
    const swalInstance =Swal.fire({
      title: 'Processing Request...',
      text: 'Please wait while we process your request.',
      didOpen: () => {
          Swal.showLoading();  
      },
      allowOutsideClick: false, 
      showConfirmButton: false,
  });
  return Swal
  }
  
}
interface User {
  user_img?: string,
  user_name: string,
  user_email: string,
  user_phone_number: string
  user_password: string,
  user_address: string,
  user_role: string,
  otp: string
}