import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { param } from 'jquery';
import { PaymentsService } from 'src/app/services/payments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  standalone:false,
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  myTransactions:Transactipon[]=[]
  isMyTransactionsAvailable:boolean=false
  filterMode:boolean=false
  sortOption:string='payment_at'
  paymentOptions: string[] = ['DebitCard', 'CreditCard', 'UPI', 'NetBanking']
  filterPaymentMode:string=''
  startDate:string=''
  endDate:string=''
  constructor(private paymentService:PaymentsService,private location:Location) { }

  ngOnInit(): void {
    this.getMyTransactions()
  }
  getMyTransactions(){
    this.paymentService.myTransactions().subscribe(
      data=>{
        this.myTransactions=data.payments_data
        this.isMyTransactionsAvailable=this.myTransactions.length>0
      },
      error=>{
        Swal.fire({
          icon: 'error',
          title: `${error.error.message}`,
          text: 'Something went wrong while fetching your transactions. Please try again later.',
          confirmButtonText: 'Okay',
        });
        console.error('Error fetching transactions:', error);
        this.location.back()
      }
    )
  }
  dataValidation(){
    if (this.startDate && this.endDate) {
      const isDateRangeValid = new Date(this.startDate) < new Date(this.endDate);
      if (!isDateRangeValid) {
        this.startDate=''
        this.endDate=''
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date Range',
          text: 'Start date must be before the end date.',
          confirmButtonText: 'Okay',
        });
      }

    }
  }
  sortBy(sort?:string){
    let params=new HttpParams()
    if(sort){
    params=params.set('sort',sort)
    if (this.sortOption==sort){
      params=params.set('order','desc')
      this.sortOption=''
    }
    else{
      this.sortOption=sort
    }
    }
    if(this.filterMode){
    if(this.filterPaymentMode!=''){
      params=params.set('payment_mode',this.filterPaymentMode)
    }
    if(this.startDate!=''){
      params=params.set('start_date',this.startDate)
    }
    if(this.endDate!=''){
      params=params.set('end_date',this.endDate)
    }
    
  }
    this.paymentService.myTransactions(params).subscribe(
      data=>{
        this.myTransactions=data.payments_data
      },
      error=>{
        console.error(error.error.message);
      }
    )
  }

  filterTransactions(){
    this.filterMode=true
    let params=new HttpParams()
    if(this.filterPaymentMode!=''){
      params=params.set('payment_mode',this.filterPaymentMode)
    }
    if(this.startDate!=''){
      params=params.set('start_date',this.startDate)
    }
    if(this.endDate!=''){
      params=params.set('end_date',this.endDate)
    }
    this.paymentService.myTransactions(params).subscribe(
      data=>{
        this.myTransactions=data.payments_data
      },
      error=>{
        console.error(error.error.message);
      }
    )
  }
  reset(){
    this.filterMode=false
    this.startDate=''
    this.endDate=''
    this.filterPaymentMode=''
    this.getMyTransactions()
  }
}
interface Transactipon {
  course_name: string;
  payment_at: string;
  payment_id: string;
  payment_mode: string;
  price: string;
}
interface PaginationInfo {
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_payments: number;
}

