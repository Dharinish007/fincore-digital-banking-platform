import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({templateUrl:'./transaction-details.page.html', styleUrls:['./transaction-details.page.css']})
export class TransactionDetailsPage implements OnInit{
  tx:any=null;
  constructor(private route:ActivatedRoute, private t:TransactionService, private router:Router){}
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id')||'';
    this.tx = this.t.getById(id);
    if(!this.tx) this.router.navigate(['history']);
  }
  back(){ this.router.navigate(['history']); }
}
