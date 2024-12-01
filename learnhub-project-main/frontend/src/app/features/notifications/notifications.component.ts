import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone:false,
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  myNotifications:Notification[]=[]
  selectedNotification:string=''
  
  constructor(private notificationService:NotificationsService,private updateService:UpdateService) { }
  ngOnInit(): void {
    this.getMyNotifications()
  }
  getMyNotifications(){
    this.notificationService.getNotifications().subscribe(
      data=>this.myNotifications=data,
      error=>console.error(error.error.message)
    )
  }
  // option(event:Event){
  //   event.stopPropagation()
  //   const icon=event.target as HTMLElement
  //   const list=icon.nextSibling as HTMLElement
  //   list.style.display='block'
  //   console.log(list.style.display)

  // }
  read(notification:Notification){
  const notification_id=notification.notification_id
  notification.notification_read_status=true
  this.selectedNotification=this.selectedNotification==notification_id?'':notification_id
  this.markThisNotifcationAsRead(notification.notification_id)
  }
  markAsRead(event:Event,notification:Notification){
    event.stopPropagation()
    notification.notification_read_status=true
    this.markThisNotifcationAsRead(notification.notification_id)
    this.updateService.updateNotificationCount(true)
  }
  markThisNotifcationAsRead(notification_id:string){
    this.notificationService.markThisNotifcationAsRead(notification_id).subscribe(
      data=>{
          this.updateService.updateNotificationCount(true)  
      }
    )
  }
  deleteNotification(event:Event,notification:Notification){
    event.stopPropagation()
    this.notificationService.deleteThisNotification(notification.notification_id).subscribe(
      data=>{
        this.getMyNotifications()
        this.updateService.updateNotificationCount(true)
      }
    )
  }
  markAllAsRead(){
    this.notificationService.markAllNotificationsAsRead().subscribe(
      data=>{
        this.getMyNotifications()
        this.updateService.updateNotificationCount(true)
      }
    )
  }
  clearNotifcations(){
    this.notificationService.deleteAllNotifications().subscribe(
      data=>{
        this.getMyNotifications()
        this.updateService.updateNotificationCount(true)
      }
    )
  }
  
  
}
interface Notification {
  created_at: string;
  notification_id: string;
  notification_message: string; 
  notification_read_status: boolean; 
  notification_title: string;
}

// src/toastr.d.ts

