import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  standalone:false,
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  searchCourse: string ='';

  updateData(newData: string) {
    this.searchCourse = newData; 
  }
  constructor() { }

  ngOnInit(): void {
  }

}
