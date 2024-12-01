import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SearchService } from 'src/app/services/search.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  standalone:false,
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent implements OnInit {
  img:null|string=null;
  userName:string|null=null
  isSmallScreen: boolean = false;
  notificationCount:number=0
  constructor(private scrollingService:ScrollService,private updateService:UpdateService,private sharedService:SearchService,private authentication:AuthenticationService,private router:Router,private notificationService:NotificationsService) { }

  ngOnInit(): void {
    this.getImg()
    this.sharedService.getProfileStatus.subscribe(
      status=>{
        if(status){
          this.getImg()
        }
      }
    )
    this.onResize();
    this.getNotififcationsCount()
    this.updateService.isNotificationsChange.subscribe(
      status=>{
        if(status){
          this.getNotififcationsCount()
        }
      }
    )
  }
  getImg(){
    this.img=localStorage.getItem('img');
    this.userName=localStorage.getItem('name');
    if(this.img=="null"){
      this.img="../../../../assets/profile.png"
    }
  }
  getNotififcationsCount(){
    this.notificationService.getNotificationCount().subscribe(
      data=>this.notificationCount=data
    )
  }
  scrollToFooter(section:string): void {
    this.scrollingService.scrollTo(section);
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth <576;
  }
  logout(){
    this.authentication.logout()
    this.router.navigate(['/home'])
  }
  
}
