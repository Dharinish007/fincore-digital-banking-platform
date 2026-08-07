import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  templateUrl: './initiate-transaction.page.html',
  styleUrls: ['./initiate-transaction.page.css']
})
export class InitiateTransactionPage implements OnInit{
  form = this.fb.group({
    sender:['',[Validators.required, Validators.pattern(/^\d{12}$/)]],
    receiver:['',[Validators.required, Validators.pattern(/^\d{12}$/)]],
    type:['',Validators.required],
    amount:[0,[Validators.required, Validators.min(1)]],
    reference:['',Validators.required],
    description:[''],
    date:[new Date(),Validators.required]
  });
  constructor(private fb:FormBuilder, private tx:TransactionService, private router:Router){}
  ngOnInit(){
    const p = this.tx.getPending();
    if(p){
      this.form.patchValue({
        sender:p.sender, receiver:p.receiver, type:p.type, amount:p.amount, reference:p.reference, description:p.description || '', date: p.date? new Date(p.date): new Date()
      });
    }
  }
  reset(){this.form.reset({amount:0,date:new Date()})}
  validateAll(){this.form.markAllAsTouched()}
  proceed(){
    if(this.form.invalid) return this.validateAll();
    const v = this.form.value as any;
    const transaction = {
      id:'', sender:v.sender, receiver:v.receiver, type:v.type, amount:v.amount,
      reference:v.reference, date:(v.date instanceof Date)? v.date.toISOString() : new Date(v.date).toISOString(), status:'Pending', charges:0, description:v.description
    };
    this.tx.setPending(transaction as any);
    this.router.navigate(['transaction-confirmation']);
  }
}
