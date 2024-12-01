import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor() { }
  private notifications = new BehaviorSubject<boolean>(false);
  isNotificationsChange = this.notifications.asObservable();

  private profile = new BehaviorSubject<boolean>(false)
  isPorfileUpdated = this.profile.asObservable()

  updateNotificationCount(status: boolean) {
    this.notifications.next(status);
  }
  updateProfile(status: boolean) {
    this.profile.next(status)
  }
}
