// In your categoryadd.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoryadd',
  templateUrl: './categoryadd.component.html',
  standalone:false,
  styleUrls: ['./categoryadd.component.css']
})
export class CategoryaddComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;
  errorMessage: string | null = null;
  categoryForm!: FormGroup;
  categories: string[] = [];
  newCategory: string = ''; 
  isCategoryAlreadyExists: boolean = false;

  constructor(private formBuilder: FormBuilder, private categoryServices: CategoryService,private router:Router) {
    this.categoryForm = this.formBuilder.group({
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$')]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryServices.getCategories().subscribe(
      data => {
        if (data.length > 0) {
          this.categories = data.map((category: { category_name: string }) => category.category_name.toLocaleLowerCase());
        } else {
          console.log("No categories available");
        }
      },
      error => {
        console.error("Error Fetching Categories", error);
      }
    );
  }

  checkCategoryExists(): boolean {
    return this.categories.includes(this.newCategory.trim());
  }

  addCategory(): void {
    this.newCategory = this.categoryForm.get('category')?.value?.toLowerCase();
    if (this.categoryForm.valid && !this.checkCategoryExists()) {
      let category = { category_name: this.newCategory };
      this.categoryServices.addCategory(category).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'The category was successfully added.',
          confirmButtonText: 'OK'
        });
          this.closeModal();
          this.categoryForm.reset();
          this.newCategory = '';
          this.errorMessage = null;
      },
      error => {
          this.errorMessage = error.error.message;
      });
    } else if (this.checkCategoryExists()) {
      this.errorMessage = 'Category already exists';
    }
  }

  closeModal(): void {
    const content=document.querySelector('.modal-open') as HTMLElement;
          if (content) {
            content.style.overflow = 'scroll'; 
          }
    const modalElement = this.modal.nativeElement;
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';  
      document.body.classList.remove('modal-open');  
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();  
      }
      this.router.navigate(['home'])
    }
  }
}
