import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-pdf-veiwer',
  templateUrl: './pdf-veiwer.component.html',
  styleUrls: ['./pdf-veiwer.component.css']
})
export class PdfVeiwerComponent implements OnInit {
  pdf!:string
  constructor(private activatedRouter:ActivatedRoute,public sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.pdf=this.activatedRouter.snapshot.params['url']
  }

}
