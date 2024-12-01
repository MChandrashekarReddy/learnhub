import { Component, EventEmitter, HostListener, OnInit,Output } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SearchService } from 'src/app/services/search.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-instructor-nav',
  templateUrl: './instructor-nav.component.html',
  standalone:false,
  styleUrls: ['./instructor-nav.component.css']
})
export class InstructorNavComponent implements OnInit {
  searchCourse: string ='';
  img:null|string=null;
  userName:string|null=null
  notificationCount:number=0
  isSmallScreen: boolean = false;
  constructor(private scrollingService:ScrollService,private authentication:AuthenticationService,private router:Router,private searchService:SearchService,private notificationService:NotificationsService,private updateService:UpdateService) { }

  ngOnInit(): void {
    this.img=localStorage.getItem('img')
    this.userName=localStorage.getItem('name');
    if(this.img=="null"){
      this.img="https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
    this.getNotififcationsCount()
    this.onResize()
    this.updateService.isNotificationsChange.subscribe(
      status=>{
        if(status){
          this.getNotififcationsCount()
        }
      }
    )
  }
  scrollToFooter(section:string): void {
    this.scrollingService.scrollTo(section);
  }

  onSearchChange(event: any) {
    this.searchCourse = event.target.value;
    this.searchService.changeSearchCourse(this.searchCourse);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?:Event) {
    this.isSmallScreen = window.innerWidth < 600;
  }
  logout(){
    this.authentication.logout()
    this.router.navigate(['/home'])
  }
  getNotififcationsCount(){
    this.notificationService.getNotificationCount().subscribe(
      data=>this.notificationCount=data
    )
  }
}

