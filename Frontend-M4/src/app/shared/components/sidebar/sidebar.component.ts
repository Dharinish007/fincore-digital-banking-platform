import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  developer?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;

  public navItems: NavItem[] = [
    {
      label: 'Document OCR',
      icon: 'badge',
      route: '/document-ocr',
      developer: 'Manikandan'
    },
    {
      label: 'Liveness Detection',
      icon: 'videocam',
      route: '/liveness-detection',
      developer: 'Kousalya'
    },
    {
      label: 'Face Match Accuracy',
      icon: 'face',
      route: '/face-match',
      developer: 'Pavithra'
    }
  ];
}
