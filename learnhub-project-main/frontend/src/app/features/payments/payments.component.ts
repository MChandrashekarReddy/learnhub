import { Component, OnInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';

export interface Payment {
  course_name: string;
  payment_at: string;
  payment_id: string;
  payment_mode: string;
  price: number;
  user_name: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  standalone:false,
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  datesRange:string[]=['1 Day Ago',
    '1 Week Ago',
    '1 Month Ago',
    '3 Months Ago',
    '6 Months Ago',
    '1 Year Ago'
    ]
  paymentModes:string[]=[]
  filteredPayments: Payment[] = [];
  displayedPayments: Payment[] = [];
  pageSize: number = 10;
  pageIndex: number = 0;
  searchCourse: string = '';

  constructor(private paymentService: PaymentsService) {}

  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllPayments(): void {
    this.paymentService.getAllPayments().subscribe(
      (data: Payment[]) => {
        this.payments= data.map((item: any) => ({
          payment_at: item.payment_at,
          payment_id: item.payment_id,
          payment_mode: item.payment_mode,
          course_name: item.course_name,
          price: Number(item.price),
          user_name: item.user_name
        }));
        this.payments.forEach(payment => {
          if (this.paymentModes.indexOf(payment.payment_mode) === -1) {
            this.paymentModes.push(payment.payment_mode);
          }
        });
        this.filteredPayments = this.payments; 
        this.updateDisplayedPayments();
      },
      (error) => {
        console.error('Error fetching payments:', error.message);
      }
    );
  }

  updateDisplayedPayments(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedPayments = this.filteredPayments.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPayments();
  }

  sortBy(event: Event): void {
    const target = event.target as HTMLSelectElement | null; 
    if (target) {
      const property = target.value as keyof Payment; 
      const PaymentsToSort: Payment[] = [...this.filteredPayments]; 
      PaymentsToSort.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];
        if (property === 'payment_at') {
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

      this.filteredPayments = PaymentsToSort;
      this.updateDisplayedPayments(); 
    }
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.filteredPayments = this.filteredCourseByName; 
    this.updateDisplayedPayments(); 
  }

  get filteredCourseByName(): Payment[] {
    return this.payments.filter(payment => 
      payment.course_name.toLowerCase().includes(this.searchCourse.toLowerCase())
    );
  }
  selectedFilters: { dates: string[], modes: string[] } = { dates: [], modes: [] };

  filterSelection(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
        if (this.datesRange.includes(value)) {
            this.selectedFilters.dates.push(value);
        } else {
            this.selectedFilters.modes.push(value);
        }
    } else {
        if (this.datesRange.includes(value)) {
            this.selectedFilters.dates = this.selectedFilters.dates.filter(date => date !== value);
        } else {
            this.selectedFilters.modes = this.selectedFilters.modes.filter(mode => mode !== value);
        }
    }

    this.filterPayments();
}
filterPayments(): void {
  this.filteredPayments = this.payments; 

  if (this.selectedFilters.dates.length > 0 || this.selectedFilters.modes.length > 0) {
      this.filteredPayments = this.payments.filter(payment => {
          const dateMatches = this.selectedFilters.dates.length === 0 || this.selectedFilters.dates.includes(this.getDateRange(payment.payment_at));
          const modeMatches = this.selectedFilters.modes.length === 0 || this.selectedFilters.modes.includes(payment.payment_mode);
          return dateMatches && modeMatches;
      });
  }

  this.updateDisplayedPayments();
}

getDateRange(paymentDate: string): string {
  const paymentDateObj = new Date(paymentDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - paymentDateObj.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) return '1 Day Ago';
  if (diffDays <= 7) return '1 Week Ago';
  if (diffDays <= 30) return '1 Month Ago';
  if (diffDays <= 90) return '3 Months Ago';
  if (diffDays <= 180) return '6 Months Ago';
  if (diffDays <= 365) return '1 Year Ago';

  return ''; 
}

}


export interface Payment {
  course_name: string;
  payment_at: string; 
  payment_id: string;
  payment_mode: string;
  price: number; 
  user_name: string;
}
