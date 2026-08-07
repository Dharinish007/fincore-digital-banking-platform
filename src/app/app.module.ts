import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { DashboardPage } from './pages/dashboard/dashboard.page';
import { InitiateTransactionPage } from './pages/initiate-transaction/initiate-transaction.page';
import { TransactionConfirmationPage } from './pages/transaction-confirmation/transaction-confirmation.page';
import { TransactionStatusPage } from './pages/transaction-status/transaction-status.page';
import { TransactionHistoryPage } from './pages/transaction-history/transaction-history.page';
import { TransactionDetailsPage } from './pages/transaction-details/transaction-details.page';
import { ReportsPage } from './pages/reports/reports.page';
import { ProfilePage } from './pages/profile/profile.page';
import { SettingsPage } from './pages/settings/settings.page';
import { SupportPage } from './pages/support/support.page';

import { TransactionService } from './services/transaction.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardPage,
    InitiateTransactionPage,
    TransactionConfirmationPage,
    TransactionStatusPage,
    TransactionHistoryPage,
    TransactionDetailsPage,
    ReportsPage,
    ProfilePage,
    SettingsPage,
    SupportPage
  ],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, FormsModule, HttpClientModule, AppRoutingModule, MaterialModule],
  providers: [TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule {}
