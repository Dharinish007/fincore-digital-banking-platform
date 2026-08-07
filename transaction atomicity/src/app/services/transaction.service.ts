import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private transactions: Transaction[] = [];
  private pending: Transaction | null = null;
  private tx$ = new BehaviorSubject<Transaction[]>([]);

  constructor(){
    this.seed();
  }

  seed(){
    // create some dummy transactions
    for(let i=1;i<=12;i++){
      const t: Transaction = {
        id: 'TX' + (1000+i),
        sender: '111122223333',
        receiver: '444455556666',
        type: i%3===0? 'Deposit' : (i%2===0? 'Withdraw':'Transfer'),
        amount: Math.round(Math.random()*5000)+100,
        date: new Date(Date.now()-i*3600*1000*24).toISOString(),
        reference: 'REF' + (10000+i),
        status: i%5===0? 'Failed' : 'Success',
        charges: Math.round(Math.random()*20)
      };
      this.transactions.push(t);
    }
    this.tx$.next(this.transactions.slice());
  }

  list(): Observable<Transaction[]>{
    return this.tx$.asObservable();
  }

  getById(id:string): Transaction | undefined{
    return this.transactions.find(t=>t.id===id) || (this.pending && this.pending.id===id? this.pending: undefined);
  }

  // wrapper to match requested API
  createTransaction(tx: Transaction){ this.setPending(tx); }
  getCurrentTransaction(){ return this.getPending(); }
  updateTransactionStatus(id:string, status: Transaction['status'], failureReason?:string){
    const idx = this.transactions.findIndex(t=>t.id===id || t.reference===id);
    if(idx>=0){ this.transactions[idx].status = status as Transaction['status']; if(failureReason) this.transactions[idx].failureReason = failureReason; this.tx$.next(this.transactions.slice()); }
    if(this.pending && (this.pending.id===id || this.pending.reference===id)) { this.pending.status = status as Transaction['status']; if(failureReason) this.pending.failureReason = failureReason; }
  }
  getTransactionById(id:string){ return this.getById(id); }
  getTransactionHistory(){ return this.list(); }

  setPending(tx: Transaction){
    this.pending = tx;
  }

  getPending(){
    return this.pending;
  }

  confirm(tx: Transaction){
    // simulate processing
    tx.id = 'TX' + Math.floor(Math.random()*900000+100000).toString();
    tx.status = 'Processing';
    this.pending = tx;
    // push to list as pending
    const saved = {...tx, status: 'Pending'} as Transaction;
    this.transactions.unshift(saved);
    this.tx$.next(this.transactions.slice());
    // simulate asynchronous result
    setTimeout(()=>{
      const success = Math.random() > 0.15;
      const status = success? 'Success':'Failed';
      const idx = this.transactions.findIndex(t=>t.reference===tx.reference);
      if(idx>=0){
        this.transactions[idx].status = status;
        this.transactions[idx].id = tx.id;
      }
      this.pending = {...tx, status};
      this.tx$.next(this.transactions.slice());
    }, 1800 + Math.random()*2200);
    return of(tx);
  }
}
