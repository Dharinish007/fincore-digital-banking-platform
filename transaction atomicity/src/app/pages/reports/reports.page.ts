import { Component } from '@angular/core';

@Component({templateUrl:'./reports.page.html', styleUrls:['./reports.page.css']})
export class ReportsPage{
  // simple dummy data
  period='Daily';
  generate(){ alert('Report generated (dummy)'); }
}
