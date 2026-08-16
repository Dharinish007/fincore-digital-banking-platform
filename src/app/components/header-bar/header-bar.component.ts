import { Component } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  standalone: false,
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent {
  userName = 'Ananya Gupta';
}
