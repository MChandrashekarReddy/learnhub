import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { data } from 'jquery';
import { ProgressService } from 'src/app/services/progress.service';
import { SearchService } from 'src/app/services/search.service';
import { VideoSharedService } from 'src/app/services/video-shared.service';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  standalone:false,
  styleUrls: ['./content-management.component.css']
})
export class ContentManagementComponent implements OnInit,OnDestroy {
  courseName!: string;
  videoSrc: string=''; 
  status:boolean=true;
  video!:Video
  totalPlayTime: number = 0;
  lastTimeUpdate: number = 0;
  isStudent:boolean=false

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shredService: SearchService,
    private videoSharedService: VideoSharedService,
    private progressService:ProgressService
  ) {}  

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isStudent=this.router.url.startsWith("/student");
    this.videoSharedService.currentVideo.subscribe(data => {
      if(this.status){
        if (this.isStudent)this.addProgress()
        this.video=data;
        this.videoSrc=this.video.content_video
        this.videoSharedService.currentplayingVideo(data.content_video);
      }
      if (data) {
        this.status=true
      }
    });
    this.courseName = this.activatedRoute.snapshot.params['name'];
    this.navigateTo('content');
    this.shredService.setCourseName(this.courseName);
  }

  navigateTo(route: string) {
    if(route!=="content"){
      this.status=false;
    }
    this.router.navigate([`${route}`], { relativeTo: this.activatedRoute,skipLocationChange:true});
  }
  ngOnDestroy(): void {
    if (this.isStudent)this.addProgress()
    this.videoSrc=''
    this.videoSharedService.changeVideo('');
  }

  onTimeUpdate(): void {
    const currentTime = this.videoPlayer.nativeElement.currentTime;
    if (currentTime>this.totalPlayTime){
      this.totalPlayTime=currentTime
    }
  }
  addProgress(){
    if(this.totalPlayTime!=0){
    const totalDurationArray=this.video.duration.split(":")
    const totalDuration=(Number(totalDurationArray[0])*60)+(Number(totalDurationArray[1]))
    const  progress_percentage=Math.round((this.totalPlayTime/totalDuration)*100)
    if(progress_percentage>this.video.completion_percentage){
      console.log(progress_percentage);
      this.videoSharedService.updateContent({"content_id":this.video.content_id,"percentage":progress_percentage})
      this.progressService.addProgress({"content_id":this.video.content_id,"course_name":this.courseName,"progress_percentage":progress_percentage}).subscribe(
        data=>console.log("successfully added to database"),
        error=>console.error(error.error.message)
      )
    }
    this.totalPlayTime=0
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
