import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { ContentsService } from 'src/app/services/contents.service';
import { ProgressService } from 'src/app/services/progress.service';
import { SearchService } from 'src/app/services/search.service';
import { VideoSharedService } from 'src/app/services/video-shared.service';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  standalone:false,
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit {
  courseName!:string
  videoSrc:string=''
  currentPlayingVideo:string=''
  videos:Video[]=[]
  isStudent:boolean=false
  constructor(private router:Router, private progressService:ProgressService,private contentService:ContentsService,private shredCourse:SearchService,private videoSharedService:VideoSharedService) { 
  }

  ngOnInit(): void {
    this.shredCourse.currentCourse.subscribe(courseName => {
      this.courseName = courseName; 
    });
    if(this.courseName){
      this.getVideos(this.courseName)
    }
    this.videoSharedService.playningVideo.subscribe(video=>this.currentPlayingVideo=video)
    this.isStudent=this.router.url.startsWith("/student");
    this.videoSharedService.update.subscribe(
      data=>{
       const contentId=data.content_id
       const progressive_per=data.percentage
       this.videos.forEach(video=>{
        if(video.content_id==contentId){
          video.completion_percentage=progressive_per
        }
       })
      }
    )
    
  }
  getVideos(courseName:string){
    this.contentService.getVideos(courseName).subscribe(
      data=>{
        this.videos=data;
        this.playVideo(this.videos[0]);
        this.videoSrc=this.videos[0].content_video
      },
      error=>{
        console.log(error.error.message);
      }
    )
  }
  playVideo(video:any){
    this.videoSrc=video
    this.videoSharedService.changeVideo(video);
  }
  onCheck(event: Event, contentId: string) {
    event.stopPropagation();
    const response=event.target as HTMLInputElement
    if(response.checked){
      this.progressService.addProgress({"content_id":contentId,"course_name":this.courseName,"progress_percentage":100}).subscribe(
        data=>{
          this.videos.forEach(video=>{
            if(video.content_id==contentId){
              video.completion_percentage=100
            }
           })
        },
        error=>console.error(error.error.message)
      )
    } 
    else{
      this.progressService.deleteProgress(contentId,this.courseName).subscribe(
        data=>{
          this.videos.forEach(video=>{
            if(video.content_id==contentId){
              video.completion_percentage=0
            }
           })
        },
        error=>console.error(error.error.message)
      )
    }
  }

}
export interface Video{
  content_id:string,
  content_name:string,
  content_video: any,
  duration:string,
  completion_percentage:number
}
