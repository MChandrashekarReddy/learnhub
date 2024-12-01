import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { SearchService } from 'src/app/services/search.service';
import { UpdateService } from 'src/app/services/update.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  standalone:false,
  styleUrls: ['./profile-management.component.css']
})
export class ProfileManagementComponent implements OnInit {
  img: string | null = null;
  profileForm!: FormGroup;
  userProfile?: User;
  mode: string = "Edit";
  imageStatus: string = ''
  constructor(private userService: UserService, private fb: FormBuilder,private sheredServcie:SearchService,private updateService:UpdateService) {
    this.profileForm = this.fb.group({
      user_img: ['', [Validators.minLength(3), Validators.maxLength(1000), Validators.pattern(/.*\.(jpg|jpeg|png|gif)$/)]],
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500), Validators.pattern(/^(?! )[A-Za-z0-9]+( [A-Za-z0-9]+)*$/)]],
      user_address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500), Validators.pattern(/^(?! )[A-Za-z0-9 ,.-]+( [A-Za-z0-9 ,.-]+)*[^ ]$/)]]
    });
  }

  ngOnInit(): void {
    this.getProfile();
    this.updateService.isPorfileUpdated.subscribe(
      status=>{
        if(status){
          this.getProfile()
        }
      }
    )
  }

  getProfile() {
    this.userService.getUserProfilel().subscribe(
      data => {
        this.userProfile = data;
        this.patchValues()
      },
      error => {
        console.log(error.error.message);
      }
    );
  }
  patchValues() {
    const userImg = this.userProfile?.user_img ? this.userProfile.user_img : "../../../assets/profile.png";
    localStorage.setItem('img', userImg)
    if(this.userProfile?.user_name){
    localStorage.setItem('name',this.userProfile?.user_name)
    }
    this.sheredServcie.changeProfileStatus(true)
    this.imageStatus = this.userProfile?.user_img ? "Edit Image" : "Add Image";
    this.profileForm.patchValue({
      user_img: userImg,
      user_name: this.userProfile?.user_name,
      user_address: this.userProfile?.user_address
    });
  }

  triggerFileInput() {
    const input = document.createElement("input");
    input.type = 'file';
    input.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.imageStatus = "Edit Image"
        this.profileForm.patchValue({
          user_img: `../../../assets/${file.name}`
        });
        input.remove();
      }
    });
    input.click();
  }
  isChanged(): boolean {
    const userImg = this.userProfile?.user_img ? this.userProfile.user_img : "../../../assets/profile.png";
    if (this.profileForm.value.user_img != userImg) return true
    if (this.profileForm.value.user_name != this.userProfile?.user_name) return true
    if (this.profileForm.value.user_address != this.userProfile?.user_address) return true
    return false
  }
  update(event:Event) {
    event.preventDefault()
    if (this.mode == "Save") {
      if (this.isChanged()) {
        const user = {
          user_name: this.profileForm.value.user_name,
          user_address: this.profileForm.value.user_address,
          user_img: this.profileForm.value.user_img === "../../../assets/profile.png" ? "null" : this.profileForm.value.user_img
        };
        this.updateUser(user)
      }
      else {
        const option = confirm("No changes were made. Do you want to keep the current data as it is?")
        console.log(option);
        if (option) {
          this.mode = "Edit"
        }
      }
    } else {
      this.mode = "Save";
    }
  }
  updateUser(user: any) {
    this.userService.updateDetails(user).subscribe(
      data => {
        this.getProfile()
        const userImg = this.userProfile?.user_img ? this.userProfile.user_img : "null";
        alert(data.message)
        this.mode = "Edit"
      },
      error => alert(error.error.message)
    )
  }
  removeImg() {
    this.profileForm.patchValue({
      user_img: "../../../assets/profile.png",
    });
    this.imageStatus = "Add Image"
  }
  resetForm(): void {
    this.patchValues()
  }
}

export interface User {
  user_address: string;
  user_created_at: string;
  user_email: string;
  user_img: string | null;
  user_name: string;
  user_phone_number: string;
  user_role: string;
  user_updated_at: string;
}
