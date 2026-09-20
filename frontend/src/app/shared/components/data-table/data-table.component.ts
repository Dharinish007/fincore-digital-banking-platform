import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface TableColumn {
  def: string;
  header: string;
  type?: 'text' | 'date' | 'currency' | 'action' | 'badge';
  actionIcon?: string;
  actionColor?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() set data(value: any[]) {
    this.dataSource.data = value || [];
  }
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  
  @Output() actionClicked = new EventEmitter<{ action: string, row: any }>();

  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get displayedColumns(): string[] {
    return this.columns.map(c => c.def);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onActionClick(action: string, row: any) {
    this.actionClicked.emit({ action, row });
  }
}
