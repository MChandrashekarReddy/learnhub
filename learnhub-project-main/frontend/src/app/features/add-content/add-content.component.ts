import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentsService } from 'src/app/services/contents.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  standalone:false,
  styleUrls: ['./add-content.component.css']
})
export class AddContentComponent implements OnInit {
  contentForm!: FormGroup
  path: string = '../../../assets/'
  errorMessage: string | null = null;
  @Input() courseName: string = '';
  address: string = ''
  ngOnInit(): void {


  }
  constructor(private router: Router, private contentservice: ContentsService, private fb: FormBuilder) {
    this.contentForm = this.fb.group({
      course_name: [{ value: this.courseName, disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      content_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000), Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]],
      content_doc_path: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      content_video_path: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      content_quiz_path: ['', [Validators.minLength(2), Validators.maxLength(500)]],
      content_assignment_path: ['', [Validators.minLength(2), Validators.maxLength(500)]],
    })
  }
  onSubmit() {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we add the content.',
      didOpen: () => {
        Swal.showLoading();
      },
      showConfirmButton: false, 
      allowOutsideClick: false,
    });
    const contentData = {
      course_name: this.courseName,
      content_name: this.contentForm.get('content_name')?.value || null,
      content_doc_path: this.contentForm.get('content_doc_path')?.value? this.path + this.contentForm.get('content_doc_path')?.value.slice(12): null,
      content_video_path: this.contentForm.get('content_video_path')?.value? this.path + this.contentForm.get('content_video_path')?.value.slice(12): null,
      content_quiz_path: this.contentForm.get('content_quiz_path')?.value? this.path + this.contentForm.get('content_quiz_path')?.value.slice(12): null,
      content_assignment_path: this.contentForm.get('content_assignment_path')?.value? this.path + this.contentForm.get('content_assignment_path')?.value.slice(12): null
    };

    this.contentservice.addContent(contentData).subscribe(
      data => {
        Swal.fire({
          icon: 'success',
          title: 'Content Added Successfully!',
          text: 'The content was successfully added.',
          confirmButtonText: 'OK'
        });
        const content = document.querySelector('.modal-open') as HTMLElement;
        const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
        if (content) {
          content.style.overflow = 'scroll';
        }

        if (backdrop) {
          backdrop.remove();
        }
        this.contentForm.reset()
        this.router.navigate(['./'])
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops! Something went wrong.',
          text: 'There was an issue updating the course. Please try again later.',
          confirmButtonText: 'OK',
        });
        this.errorMessage = error.error.message
      }
    )
  }
  close(event: Event) {
    this.contentForm.reset()
  }
}

