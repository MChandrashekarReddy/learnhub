import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone:false,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  email:string="mc@learnhub.com"
  phonenumber:string="+919494485010"
  constructor() { }

  ngOnInit(): void {
  }

}
