import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoanOriginationRoutingModule } from './loan-origination-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PreQualificationPageComponent } from './pages/pre-qualification-page/pre-qualification-page.component';
import { LoanApplicationPageComponent } from './pages/loan-application-page/loan-application-page.component';
import { ApplicationsPageComponent } from './pages/applications-page/applications-page.component';
import { ApplicationProcessingPageComponent } from './pages/application-processing-page/application-processing-page.component';
import { UnderwritingPageComponent } from './pages/underwriting-page/underwriting-page.component';
import { QualityControlPageComponent } from './pages/quality-control-page/quality-control-page.component';
import { LoanFundingPageComponent } from './pages/loan-funding-page/loan-funding-page.component';
import { CreditCheckPageComponent } from './pages/credit-check-page/credit-check-page.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { ApplicationCardComponent } from './components/application-card/application-card.component';
import { DocumentStatusCardComponent } from './components/document-status-card/document-status-card.component';
import { QualityChecklistComponent } from './components/quality-checklist/quality-checklist.component';
import { FundingSummaryCardComponent } from './components/funding-summary-card/funding-summary-card.component';
import { StatusClassPipe } from './pipes/status-class.pipe';

@NgModule({
  declarations: [
    AppShellComponent,
    SidebarComponent,
    HeaderBarComponent,
    ProgressTrackerComponent,
    DashboardPageComponent,
    PreQualificationPageComponent,
    LoanApplicationPageComponent,
    ApplicationsPageComponent,
    ApplicationProcessingPageComponent,
    UnderwritingPageComponent,
    QualityControlPageComponent,
    LoanFundingPageComponent,
    CreditCheckPageComponent,
    ApplicationCardComponent,
    DocumentStatusCardComponent,
    QualityChecklistComponent,
    FundingSummaryCardComponent,
    StatusClassPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoanOriginationRoutingModule
  ]
})
export class LoanOriginationModule {}
