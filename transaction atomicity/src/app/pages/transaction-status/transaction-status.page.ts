import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({templateUrl: './transaction-status.page.html', styleUrls:['./transaction-status.page.css']})
export class TransactionStatusPage implements OnInit{
  tx:any=null; status='Processing'; id='';
  sub:any;
  constructor(private route:ActivatedRoute, private t:TransactionService, private router:Router){}
  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id')|| '';
    if(this.id === '0') { this.id = ''; }
    const p = this.t.getPending();
    if(p && (p.id===this.id || this.id==='')){ this.tx = p; }
    else if(this.id){ this.tx = this.t.getById(this.id); }
    if(this.tx) this.status = this.tx.status || 'Processing';
    this.sub = this.t.list().subscribe(list=>{
      const found = this.id ? list.find((x:any)=> x.id===this.id || x.reference===this.id) : undefined;
      if(found) { this.tx = found; this.status = found.status; }
      else if(!this.id){ const pp = this.t.getPending(); if(pp){ this.tx = pp; this.status = pp.status; } }
    });
  }
  retry(){
    if(!this.tx) return;
    this.t.confirm(this.tx).subscribe(()=>{});
  }
  viewDetails(){ if(!this.tx) return; this.router.navigate(['transaction-details', this.tx.id || this.tx.reference]); }
  back(){ this.router.navigate(['']); }
  ngOnDestroy(){ this.sub?.unsubscribe(); }
}
