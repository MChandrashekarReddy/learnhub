import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  standalone:false
})
export class NavComponent implements OnInit {

  constructor(private scrollingService:ScrollService) { }
  // openLoginModal() {
  //   this.modalservice.openModal();
  // }

  ngOnInit(): void {
  }
  scrollToFooter(section:string): void {
    this.scrollingService.scrollTo(section);
  }
  onclick(){
  }
  
}
