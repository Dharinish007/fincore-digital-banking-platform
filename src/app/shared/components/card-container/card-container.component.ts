import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-container',
  standalone: true,
  template: `
    <div class="corporate-card" [class.no-padding]="noPadding">
      @if (title) {
        <div class="card-header">
          <h3 class="card-title">{{ title }}</h3>
          <ng-content select="[card-actions]"></ng-content>
        </div>
      }
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/themes/mixins' as mixins;
    
    .corporate-card {
      @include mixins.corporate-card;
      
      &.no-padding .card-body {
        padding: 0;
      }
    }
    
    .card-header {
      @include mixins.flex-between;
      padding: var(--spacing-5) var(--spacing-6);
      border-bottom: 1px solid var(--border-color);
      
      .card-title {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    }
    
    .card-body {
      padding: var(--spacing-6);
    }
  `]
})
export class CardContainerComponent {
  @Input() title?: string;
  @Input() noPadding = false;
}
