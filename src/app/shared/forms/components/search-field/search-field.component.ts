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
        <button class="clear-btn" (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      background: var(--bg-surface-2);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.5rem 1rem;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      
      &:focus-within {
        border-color: var(--accent);
        box-shadow: 0 0 0 2px var(--accent-light);
        background: var(--bg-surface);
      }
    }
    
    .search-icon {
      color: var(--text-muted);
      margin-right: 0.5rem;
    }
    
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      flex: 1;
      font-size: 0.95rem;
      color: var(--text-primary);
      
      &::placeholder {
        color: var(--text-muted);
      }
    }
    
    .clear-btn {
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 50%;
      
      &:hover {
        color: var(--text-primary);
        background: var(--border-color);
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
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
