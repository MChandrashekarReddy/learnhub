import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone:false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Learn Hub';
  constructor(private router:Router){}
  ngOnInit(): void {
  //   if(localStorage.getItem('token')) {
  //     const role = localStorage.getItem('role');
  //     this.router.navigate([`/${role}`]);
  // }
  }  
}
