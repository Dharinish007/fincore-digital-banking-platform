import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PreQualificationPageComponent } from './pages/pre-qualification-page/pre-qualification-page.component';
import { LoanApplicationPageComponent } from './pages/loan-application-page/loan-application-page.component';
import { ApplicationsPageComponent } from './pages/applications-page/applications-page.component';
import { ApplicationProcessingPageComponent } from './pages/application-processing-page/application-processing-page.component';
import { UnderwritingPageComponent } from './pages/underwriting-page/underwriting-page.component';
import { QualityControlPageComponent } from './pages/quality-control-page/quality-control-page.component';
import { LoanFundingPageComponent } from './pages/loan-funding-page/loan-funding-page.component';
import { CreditCheckPageComponent } from './pages/credit-check-page/credit-check-page.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'pre-qualification', component: PreQualificationPageComponent },
      { path: 'loan-application', component: LoanApplicationPageComponent },
      { path: 'applications', component: ApplicationsPageComponent },
      { path: 'processing', component: ApplicationProcessingPageComponent },
      { path: 'underwriting', component: UnderwritingPageComponent },
      { path: 'quality-control', component: QualityControlPageComponent },
      { path: 'loan-funding', component: LoanFundingPageComponent },
      { path: 'credit-check', component: CreditCheckPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanOriginationRoutingModule {}
