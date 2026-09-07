import { Routes } from '@angular/router';
import { LivenessDetectionComponent } from './modules/liveness-detection/liveness-detection.component';
import { RiskAssessmentComponent } from './modules/risk-assessment/risk-assessment.component';
import { AuditLoggingComponent } from './modules/audit-logging/audit-logging.component';

export const routes: Routes = [
  { path: '', redirectTo: 'liveness', pathMatch: 'full' },
  { path: 'liveness', component: LivenessDetectionComponent },
  { path: 'risk', component: RiskAssessmentComponent },
  { path: 'audit', component: AuditLoggingComponent }
];
