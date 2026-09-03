import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivenessDetectionComponent } from './modules/liveness-detection/liveness-detection.component';
import { RiskAssessmentComponent } from './modules/risk-assessment/risk-assessment.component';
import { AuditLoggingComponent } from './modules/audit-logging/audit-logging.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LivenessDetectionComponent,
    RiskAssessmentComponent,
    AuditLoggingComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FinCore Nexus — Milestone 4';
  activeModule: 'liveness' | 'risk' | 'audit' = 'liveness';
  userRole: string = 'Bank Teller / Security Analyst';

  setActiveModule(module: 'liveness' | 'risk' | 'audit'): void {
    this.activeModule = module;
  }
}
