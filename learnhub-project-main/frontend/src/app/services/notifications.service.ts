import { Injectable } from '@angular/core';
import { AppEndpointsService } from '../app-endpoints.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private httpClient:HttpClient,private endpoints:AppEndpointsService,private authenticaion:AuthenticationService) { }
  getNotifications():Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.get(this.endpoints.notifications.baseurl,{headers})
  }
  markAllNotificationsAsRead():Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.put(this.endpoints.notifications.baseurl,{},{headers})
  }
  deleteAllNotifications():Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.delete(this.endpoints.notifications.baseurl,{headers})
  }
  markThisNotifcationAsRead(notification_id:string):Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.put(`${this.endpoints.notifications.baseurl}/${notification_id}`,{},{headers})
  }
  deleteThisNotification(notification_id:string):Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.delete(`${this.endpoints.notifications.baseurl}/${notification_id}`,{headers})
  }
  getNotificationCount():Observable<any>{
    const headers=this.authenticaion.getHeaders()
    return this.httpClient.get(this.endpoints.notifications.getCount,{headers})
  }
}
