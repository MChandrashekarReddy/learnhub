import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoSharedService {
  private currentvideoSubject = new BehaviorSubject<any>('');
  private playingVideoSubject=new BehaviorSubject<string>('');
  private updateContentSubject=new BehaviorSubject<any>(null)
  currentVideo= this.currentvideoSubject.asObservable();
  playningVideo=this.playingVideoSubject.asObservable();
  update=this.updateContentSubject.asObservable();
  constructor() { }
  changeVideo(video:any) {
    this.currentvideoSubject.next(video);
  }
  currentplayingVideo(video:string){
    this.playingVideoSubject.next(video)
  }
  updateContent(update:any){
    this.updateContentSubject.next(update)
  }

}
