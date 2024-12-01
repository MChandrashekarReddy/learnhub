import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categoires-management',
  templateUrl: './categoires-management.component.html',
  standalone:false,
  styleUrls: ['./categoires-management.component.css']
})
export class CategoiresManagementComponent implements OnInit {
  categoriesDetailsList: CategoryData[] = [];
  filteredCategoriesDetailsList: CategoryData[] = [];
  displayCategoriesDetailsList: CategoryData[] = [];
  categories: string[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  searchCategory: string = '';

  datesRange: string[] = [
    '1 Day Ago',
    '1 Week Ago',
    '1 Month Ago',
    '3 Months Ago',
    '6 Months Ago',
    '1 Year Ago'
  ];
  enrollmentsRange: string[] = [
    'Below 100',
    '100-500',
    '500-1000',
    '1000-2000',
    '2000-5000',
    '5000-10000',
    'Above 10000+'
  ];
  courseRange: string[] = [
    'Below 10',
    '10-25',
    '25-50',
    '50-100',
    'Above 100'
  ];
  revenueRange: string[] = [
    'Below 1000',
    '1000-5000',
    '5000-15000',
    '15000-30000',
    '30000-50000',
    '50000-100000',
    'Above 100000'
  ];

  selectedFilters: { dates: string[], enrollments: string[], courses: string[], revenue: string[] } = {
    dates: [],
    enrollments: [],
    courses: [],
    revenue: []
  };

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getAllCategorieData();
  }

  getAllCategorieData() {
    this.categoryService.getAllCategoriesdeatils().subscribe(
      data => {
        for (let category of data) {
          this.categories.push(category.category_name);
          this.categoriesDetailsList.push({
            'category_created_at': category.category_created_at,
            'category_name': category.category_name,
            'courses': Number(category.courses),
            'enrollments': Number(category.enrollments),
            'revenue': Number(category.revenue)
          });
        }
        this.filteredCategoriesDetailsList = this.categoriesDetailsList;
        this.updateCategories();
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  updateCategories(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayCategoriesDetailsList = this.filteredCategoriesDetailsList.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateCategories();
  }

  sortBy(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      const property = target.value as keyof CategoryData;
      const categoriesToSort: CategoryData[] = [...this.filteredCategoriesDetailsList];
      categoriesToSort.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        if (property === 'category_created_at') {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return dateA.getTime() - dateB.getTime();
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
        return 0;
      });
      this.filteredCategoriesDetailsList = categoriesToSort;
      this.updateCategories();
    }
  }

  filtercategories(): void {
    this.filteredCategoriesDetailsList = [...this.categoriesDetailsList];

    if (this.selectedFilters.dates.length > 0) {
      this.filteredCategoriesDetailsList = this.filteredCategoriesDetailsList.filter(category =>
        this.selectedFilters.dates.includes(this.getDateRange(category.category_created_at))
      );
    }

    if (this.selectedFilters.enrollments.length > 0) {
      this.filteredCategoriesDetailsList = this.filteredCategoriesDetailsList.filter(category =>
        this.selectedFilters.enrollments.some(range => this.isWithinRange(category.enrollments, range))
      );
    }

    if (this.selectedFilters.courses.length > 0) {
      this.filteredCategoriesDetailsList = this.filteredCategoriesDetailsList.filter(category =>
        this.selectedFilters.courses.some(range => this.isWithinRange(category.courses, range))
      );
    }

    if (this.selectedFilters.revenue.length > 0) {
      this.filteredCategoriesDetailsList = this.filteredCategoriesDetailsList.filter(category =>
        this.selectedFilters.revenue.some(range => this.isWithinRange(category.revenue, range))
      );
    }

    this.updateCategories();
  }

  isWithinRange(value: number, range: string): boolean {
    const rangeMap: { [key: string]: [number, number] } = {
      'Below 100': [0, 100],
      '100-500': [100, 500],
      '500-1000': [500, 1000],
      '1000-2000': [1000, 2000],
      '2000-5000': [2000, 5000],
      '5000-10000': [5000, 10000],
      'Above 10000+': [10000, Infinity],
      'Below 10': [0, 10],
      '10-25': [10, 25],
      '25-50': [25, 50],
      '50-100': [50, 100],
      'Above 100': [100, Infinity],
      'Below 1000': [0, 1000],
      '1000-5000': [1000, 5000],
      '5000-15000': [5000, 15000],
      '15000-30000': [15000, 30000],
      '30000-50000': [30000, 50000],
      '50000-100000': [50000, 100000],
      'Above 100000': [100000, Infinity]
    };

    const [min, max] = rangeMap[range] || [0, Infinity];
    return value >= min && value < max;
  }

  getDateRange(paymentDate: string): string {
    const paymentDateObj = new Date(paymentDate);
    const now = new Date();
    const diffTime = now.getTime() - paymentDateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  
    if (diffDays < 1) return '1 Day Ago';
    if (diffDays < 7) return '1 Week Ago';
    if (diffDays < 30) return '1 Month Ago';
    if (diffDays < 90) return '3 Months Ago';
    if (diffDays < 180) return '6 Months Ago';
    if (diffDays < 365) return '1 Year Ago';
  
    return '';
  }
  get filteredCategoriesByName(): CategoryData[] {
    return this.categoriesDetailsList.filter(category =>
      category.category_name.toLowerCase().includes(this.searchCategory.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.filteredCategoriesDetailsList = this.filteredCategoriesByName;
    this.updateCategories();
  }

  filterSelection(event: Event, filterType: keyof typeof this.selectedFilters) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedFilters[filterType].push(value);
    } else {
      this.selectedFilters[filterType] = this.selectedFilters[filterType].filter(filter => filter !== value);
    }

    this.filtercategories();
  }
}

export interface CategoryData {
  category_created_at: string;
  category_name: string;
  courses: number;
  enrollments: number;
  revenue: number;
}
