import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentsService } from 'src/app/services/contents.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-course-assignments',
  templateUrl: './course-assignments.component.html',
  standalone:false,
  styleUrls: ['./course-assignments.component.css']
})
export class CourseAssignmentsComponent implements OnInit {
  courseName!:string
  assignments:CourseAssignment[]=[]
  constructor(private contentService:ContentsService,private activatedRoute:ActivatedRoute,private router:Router,private shredCourse:SearchService) { }
  ngOnInit(): void {
    this.shredCourse.currentCourse.subscribe(courseName => {
      this.courseName = courseName; 
    });
    if(this.courseName){
      this.getAssignments(this.courseName)
    }
  }
  getAssignments(courseName:string){
    this.contentService.getAssignments(courseName).subscribe(
      data=>this.assignments=data,
      error=>console.error(error.error.message)
    )
  }
  onDownload(event:Event,file: string,fileName:string) {
    event.stopPropagation();
    const download=event.target as HTMLElement;
    const downloading=download.nextElementSibling as HTMLElement
    const downloaded=downloading.nextElementSibling as HTMLElement
    console.log(downloading);
    console.log(downloaded);
    download.style.display='none';
    downloading.style.display='block'
    const a = document.createElement("a");
    a.href = file;
    a.download = `${fileName}.pdf`; 
    document.body.appendChild(a);
    a.click(); 
    document.body.removeChild(a);
    setTimeout(()=>{
      downloading.style.display='none'
      downloaded.style.display='block'
    },3000)
    setTimeout(() => {
      downloaded.style.display='none'
      download.style.display='block'
    }, 5000);
  }
  openCardBody(event:Event){
    if(event.target){
      event.preventDefault()
      const parentElement = event.target as HTMLElement;
      const childElement=parentElement.lastChild as HTMLElement;
      childElement.style.transition = 'transform 0.05s linear';
      childElement.style.transform = childElement.style.transform === 'rotate(-90deg)' ? 'rotate(0deg)' : 'rotate(-90deg)';
      const targetElement=parentElement.nextElementSibling as HTMLElement;
      targetElement.style.display = targetElement.style.display === 'none' ? 'flex' : 'none';
    }
  }
}

interface CourseAssignment {
  content_name: string;
  content_assignment:string;
}
