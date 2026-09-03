import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FaceMatchService } from '../../services/face-match.service';
import { VerificationState } from '../../models/face-match.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() moduleTitle = 'KYC Verification Suite';
  @Input() moduleIcon = 'verified_user';
  @Output() toggleSidebar = new EventEmitter<void>();

  private faceMatchService = inject(FaceMatchService);

  public isRoleMenuOpen = false;
  public isStateMenuOpen = false;
  public currentRole = 'KYC Compliance Specialist';
  public availableRoles = ['KYC Compliance Specialist', 'Supervisor / Tier 2', 'Risk & Audit Admin'];
  
  public currentState: VerificationState = 'VERIFIED';
  public availableStates: { label: string; state: VerificationState; icon: string; color: string }[] = [
    { label: 'Verified (Passed)', state: 'VERIFIED', icon: 'check_circle', color: '#10B981' },
    { label: 'Processing (Analyzing)', state: 'PROCESSING', icon: 'sync', color: '#3B82F6' },
    { label: 'Rejected (Mismatch)', state: 'REJECTED', icon: 'cancel', color: '#EF4444' },
    { label: 'Review Required', state: 'REVIEW_REQUIRED', icon: 'warning', color: '#F59E0B' },
    { label: 'System Error', state: 'ERROR', icon: 'error_outline', color: '#94A3B8' }
  ];

  constructor() {
    this.faceMatchService.result$.subscribe(res => {
      this.currentState = res.status;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleRoleMenu(): void {
    this.isRoleMenuOpen = !this.isRoleMenuOpen;
    if (this.isRoleMenuOpen) this.isStateMenuOpen = false;
  }

  toggleStateMenu(): void {
    this.isStateMenuOpen = !this.isStateMenuOpen;
    if (this.isStateMenuOpen) this.isRoleMenuOpen = false;
  }

  setRole(role: string): void {
    this.currentRole = role;
    this.isRoleMenuOpen = false;
  }

  setState(state: VerificationState): void {
    this.faceMatchService.setVerificationState(state);
    this.isStateMenuOpen = false;
  }

  retriggerAnalysis(): void {
    this.faceMatchService.triggerReanalysis('VERIFIED');
  }
}
