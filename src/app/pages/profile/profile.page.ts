import { Component } from '@angular/core';

@Component({templateUrl:'./profile.page.html', styleUrls:['./profile.page.css']})
export class ProfilePage{
  profile = {name:'John Doe', id:'CUST001', email:'john@example.com', phone:'555-0100', branch:'Main'};
  edit=false;
  save(){ this.edit=false; alert('Profile saved (dummy)'); }
}
