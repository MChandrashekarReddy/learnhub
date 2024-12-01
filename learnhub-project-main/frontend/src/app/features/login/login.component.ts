import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone:false,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm!: FormGroup;
  passWordField = 'password';
  display: string = 'Show';
  icon = 'fa-solid fa-eye';
  errorMessage: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userservice: UserService,
    private authentication: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.close()
  }
  onsubmit(): void {
    if (this.loginForm.valid) {
      let user: User = {
        user_email: this.loginForm.value.email,
        user_password: this.loginForm.value.password,
      };
      this.userservice.login(user).subscribe(
        (data) => {
          const content=document.querySelector('.modal-open') as HTMLElement;
          const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
          if (backdrop) {
              backdrop.remove(); 
          }
          if (content) {
              content.style.overflow = 'scroll'; 
          }
          this.close()
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Login Successful!',
          //   text: 'Welcome back!',
          //   timer: 1000, 
          //   showConfirmButton: false
          // })
          this.authentication.login(data.token,data.role,data.img,data.name);
          
          this.router.navigate([`/${data.role}`]);
        },
        (error) => {
          if (error.status == 404) {
              Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: `${error.error.message}. Please try again!`,
                confirmButtonText: 'OK'
              });
            this.errorMessage = error.error.message;
            console.log(error);
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  passwordVisibility(event: Event) {
    event.stopPropagation();
    this.passWordField =
      this.passWordField === 'password' ? 'text' : 'password';
    this.display = this.display === 'Show' ? 'Hide' : 'Show';
    this.icon =
      this.icon == 'fa-solid fa-eye'
        ? 'fa solid fa-eye-slash'
        : 'fa-solid fa-eye';
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
}
interface User {
  user_email: string;
  user_password: string;
}
