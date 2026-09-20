import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="search-container">
      <mat-icon class="search-icon">search</mat-icon>
      <input 
        type="text" 
        [placeholder]="placeholder" 
        [(ngModel)]="searchTerm" 
        (ngModelChange)="onSearchChange($event)"
        class="search-input"
      >
      @if (searchTerm) {
        <button class="clear-btn" (click)="clearSearch()" type="button" aria-label="Clear search">
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 0.45rem 0.875rem;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      
      &:hover {
        border-color: var(--color-border-strong);
      }

      &:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
        background: var(--color-surface);
      }
    }
    
    .search-icon {
      color: var(--color-text-muted);
      margin-right: 0.5rem;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      flex: 1;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      
      &::placeholder {
        color: var(--color-text-muted);
        font-weight: 400;
      }
    }
    
    .clear-btn {
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border-radius: 50%;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: color var(--transition-fast), background-color var(--transition-fast);
      
      &:hover {
        color: var(--color-text-primary);
        background: var(--color-background-subtle);
      }
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Search...';
  @Input() debounceTimeMs = 300;
  
  @Output() search = new EventEmitter<string>();
  
  searchTerm = '';
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;
  
  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(this.debounceTimeMs),
      distinctUntilChanged()
    ).subscribe(term => {
      this.search.emit(term);
    });
  }
  
  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
    this.search.emit('');
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
