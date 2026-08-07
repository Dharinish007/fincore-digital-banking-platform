import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  templateUrl: './transaction-confirmation.page.html',
  styleUrls: ['./transaction-confirmation.page.css']
})
export class TransactionConfirmationPage{
  tx:any = null;
  constructor(private t:TransactionService, private router:Router){
    this.tx = this.t.getPending();
    if(!this.tx) this.router.navigate(['initiate-transaction']);
  }
  confirm(){
    if(!this.tx) return;
    this.t.confirm(this.tx).subscribe(()=>{
      this.router.navigate(['transaction-status', this.t.getPending()?.id || '']);
    });
  }
  edit(){
    this.router.navigate(['initiate-transaction']);
  }
  cancel(){
    this.t.setPending(null as any);
    this.router.navigate(['']);
  }
}
