import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { error } from 'console';
import { ContentsService } from 'src/app/services/contents.service';
import { CoursesService } from 'src/app/services/courses.service';
import { SearchService } from 'src/app/services/search.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-notes',
  templateUrl: './course-notes.component.html',
  standalone:false,
  styleUrls: ['./course-notes.component.css']
})
export class CourseNotesComponent implements OnInit {
  courseName!:string
  materials:Materials[]=[]
  constructor(private contentsService:ContentsService,private shredService:SearchService,public sanitizer: DomSanitizer) {
    this.shredService.currentCourse.subscribe(courseName=>this.courseName=courseName)
    this.getNotes(this.courseName)
   }

  ngOnInit(): void {
  }
  getNotes(courseName:string){
    this.contentsService.getMaterials(courseName).subscribe(
      data=>{
        this.materials=data;
      },
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
      const targetElemnt=parentElement.nextElementSibling as HTMLElement;
      targetElemnt.style.display = targetElemnt.style.display === 'none' ? 'flex' : 'none';
    }
  }

}
interface Materials {
  content_name: string;
  content_notes: string;
  quiz: string | null;
}

