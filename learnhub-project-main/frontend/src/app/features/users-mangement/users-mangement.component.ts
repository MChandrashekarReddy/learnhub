import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'node:test';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-mangement',
  templateUrl: './users-mangement.component.html',
  standalone:false,
  styleUrls: ['./users-mangement.component.css']
})
export class UsersMangementComponent implements OnInit {
  instructors: Instructor[] = [];
  students: Student[] = [];
  displayedInstructors: Instructor[] = [];
  displayedStudents: Student[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  userType: string | null = null;
  searchTerm: string = '';

  constructor(private userService: UserService, private datepipe: DatePipe, private activatedRoute: ActivatedRoute,private router:Router,private userdataService:UserDataService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.activatedRoute.paramMap.subscribe(params => {
      this.userType = params.get('userType');
      this.pageIndex = 0; 
      this.updateDisplayedUsers();
    });
  }

  getAllUsers(): void {
    this.userService.getAll().subscribe(
      data => {
        this.instructors = data.instructors;
        this.students = data.students;
        this.updateDisplayedUsers();
      },
      error => {
        console.error('Error occurred while fetching data:', error.error.message);
      }
    );
  }

  updateDisplayedUsers(): void {
    const users: (Instructor | Student)[] = this.userType === 'instructors' ? this.filteredInstructors : this.filteredStudents;
    const startIndex = this.pageIndex * this.pageSize;
    const paginatedUsers = users.slice(startIndex, startIndex + this.pageSize);
    
    if (this.userType === 'instructors') {
      this.displayedInstructors = paginatedUsers as Instructor[];
      this.displayedStudents = []; 
    } else {
      this.displayedStudents = paginatedUsers as Student[];
      this.displayedInstructors = [];
    }
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedUsers();
  }

  sortBy(event: Event): void {
    const target = event.target as HTMLSelectElement | null; 
    if (target) {
      const property = target.value as keyof UserCommon; 
      const users: (Instructor | Student)[] = this.userType === 'instructors' ? this.instructors : this.students;

      users.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        if (property === 'user_created_at'||property === 'user_updated_at') {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return dateA.getTime() - dateB.getTime();
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
        return 0;
      });

      this.updateDisplayedUsers();
    }
  }

  get filteredInstructors() {
    return this.instructors.filter(user =>
      user.user_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredStudents() {
    return this.students.filter(user =>
      user.user_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSearchChange(): void {
    this.pageIndex = 0; 
    this.updateDisplayedUsers();
  }
  getStudent(event:Event){
    const target = event.target as HTMLSelectElement | null;
    if(target){
      this.userdataService.setEmail(target.textContent+"")
      this.router.navigate(['/admin/studentDetail'],{skipLocationChange:true});
    }
  }
  getInstructor(event:Event){
    const target = event.target as HTMLSelectElement | null;
    if(target){
      this.userdataService.setEmail(target.textContent+"")
      this.router.navigate(['/admin/instructorDetail'],{skipLocationChange:true});
    }
  }
}

interface UserCommon {
  user_name: string;
  user_email: string;
  user_address: string;
  user_phone_number: string;
  user_created_at: string;
  user_updated_at: string;
}

export interface Instructor extends UserCommon {
  no_of_courses: number;
}

export interface Student extends UserCommon {
  no_of_enrollments: number;
}
