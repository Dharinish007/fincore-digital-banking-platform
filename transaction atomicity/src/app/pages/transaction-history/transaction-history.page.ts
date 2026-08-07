import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';

@Component({templateUrl:'./transaction-history.page.html', styleUrls:['./transaction-history.page.css']})
export class TransactionHistoryPage implements OnInit{
  list:Transaction[]=[]; filter=''; statusFilter='';
  constructor(private t:TransactionService, private router:Router){}
  ngOnInit(){ this.t.list().subscribe(l=>this.list=l); }
  open(tx:Transaction){ this.router.navigate(['transaction-details', tx.id]); }
}
