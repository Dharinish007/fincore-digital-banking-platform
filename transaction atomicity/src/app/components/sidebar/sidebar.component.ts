import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy {
  menus = [
    {label:'Dashboard', path:''},
    {label:'Initiate Transaction', path:'initiate-transaction'},
    {label:'Transaction Status', path:'transaction-status'},
    {label:'Transaction History', path:'transaction-history'},
    {label:'Transaction Details', path:'transaction-details/0'},
    {label:'Reports', path:'reports'},
    {label:'Settings', path:'settings'},
    {label:'Profile', path:'profile'},
    {label:'Support', path:'support'},
    {label:'Logout', path:'logout'}
  ];
  isOpen = false;
  sub?: Subscription;
  constructor(private router: Router, private layout: LayoutService){
    this.sub = this.layout.open$.subscribe(v=> this.isOpen = v);
  }
  navigate(p:any){
    if(p.path==='logout'){
      if(confirm('Confirm logout?')) this.router.navigate(['/']);
      return;
    }
    this.router.navigate([p.path]);
    // close sidebar on navigation (mobile)
    this.layout.close();
  }

  onNav(m:any, ev?:Event){
    if(ev){ ev.preventDefault(); }
    if(m.path === 'logout'){ this.navigate(m); return; }
    this.router.navigate([m.path]);
    this.layout.close();
  }

  close(){ this.layout.close(); }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}

