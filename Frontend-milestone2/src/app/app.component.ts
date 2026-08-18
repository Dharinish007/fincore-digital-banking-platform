import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MetricsHeaderComponent } from './components/metrics-header/metrics-header.component';
import { EmiCalculatorComponent } from './modules/emi/emi-calculator.component';
import { DisbursementComponent } from './modules/disbursement/disbursement.component';
import { CollectionsComponent } from './modules/collections/collections.component';
import { LoanServicingComponent } from './modules/loan-servicing/loan-servicing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    MetricsHeaderComponent,
    EmiCalculatorComponent,
    DisbursementComponent,
    CollectionsComponent,
    LoanServicingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  activeSidebarNav = 'EMI Calculation';
  activeModuleTab: 'SERVICING' | 'EMI' | 'DISBURSEMENT' | 'COLLECTIONS' = 'EMI';

  onSidebarNavSelect(navItem: string): void {
    this.activeSidebarNav = navItem;
    if (navItem === 'Loan Servicing') {
      this.activeModuleTab = 'SERVICING';
    } else if (navItem === 'EMI Calculation') {
      this.activeModuleTab = 'EMI';
    } else if (navItem === 'Disbursement') {
      this.activeModuleTab = 'DISBURSEMENT';
    } else if (navItem === 'Collections') {
      this.activeModuleTab = 'COLLECTIONS';
    }
  }

  setModuleTab(tab: 'SERVICING' | 'EMI' | 'DISBURSEMENT' | 'COLLECTIONS'): void {
    this.activeModuleTab = tab;
    if (tab === 'SERVICING') this.activeSidebarNav = 'Loan Servicing';
    if (tab === 'EMI') this.activeSidebarNav = 'EMI Calculation';
    if (tab === 'DISBURSEMENT') this.activeSidebarNav = 'Disbursement';
    if (tab === 'COLLECTIONS') this.activeSidebarNav = 'Collections';
  }
}
