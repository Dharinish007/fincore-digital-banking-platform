import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage implements OnInit{
  transactions: Transaction[] = [];
  stats = {total:0, success:0, failed:0, pending:0, amount:0, today:0};
  constructor(private tx: TransactionService, private router: Router){}
  ngOnInit(){
    this.tx.list().subscribe(list=>{
      this.transactions = list.slice(0,8);
      this.compute(list);
    });
  }
  compute(list:Transaction[]){
    this.stats.total = list.length;
    this.stats.success = list.filter(t=>t.status==='Success').length;
    this.stats.failed = list.filter(t=>t.status==='Failed').length;
    this.stats.pending = list.filter(t=>t.status==='Pending' || t.status==='Processing').length;
    this.stats.amount = list.reduce((s,n)=>s+n.amount,0);
    const today = new Date().toDateString();
    this.stats.today = list.filter(t=>new Date(t.date).toDateString()===today).length;
  }
  openDetails(id:string){
    this.router.navigate(['transaction-details', id]);
  }
}
