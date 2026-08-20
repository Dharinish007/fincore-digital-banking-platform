import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationStatus } from '../../models/loan.models';

interface TimelineStep {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-application-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="timeline-container">
      <div class="steps-wrapper">
        @for (step of steps; track step.key; let idx = $index) {
          <div class="step-item" [class.completed]="isStepCompleted(idx)" [class.current]="isStepCurrent(idx)" [class.rejected]="isRejected && isStepCurrent(idx)">
            <div class="step-marker">
              <mat-icon>{{ getStepIcon(step, idx) }}</mat-icon>
            </div>
            <div class="step-content">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-subtitle">{{ getStepSubtitle(step, idx) }}</span>
            </div>
            @if (idx < steps.length - 1) {
              <div class="step-line" [class.line-active]="isStepCompleted(idx)"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      width: 100%;
      padding: 1.5rem 0.5rem;
    }

    .steps-wrapper {
      display: flex;
      justify-content: space-between;
      position: relative;
      gap: 1rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
      }
    }

    .step-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;

      @media (max-width: 768px) {
        flex-direction: row;
        text-align: left;
        gap: 1rem;
      }
    }

    .step-marker {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--color-background-subtle);
      border: 2px solid var(--color-border);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      z-index: 2;
      transition: all var(--transition-fast);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .step-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    .step-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .step-line {
      position: absolute;
      top: 21px;
      left: 50%;
      width: 100%;
      height: 2px;
      background: var(--color-border);
      z-index: 1;

      @media (max-width: 768px) {
        display: none;
      }

      &.line-active {
        background: var(--color-success, #16a34a);
      }
    }

    /* Completed state */
    .step-item.completed {
      .step-marker {
        background: var(--color-success-bg, #dcfce7);
        border-color: var(--color-success, #16a34a);
        color: var(--color-success, #16a34a);
      }
      .step-title {
        color: var(--color-text-primary);
      }
    }

    /* Current active state */
    .step-item.current {
      .step-marker {
        background: var(--color-primary-light);
        border-color: var(--color-primary);
        color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
      }
      .step-title {
        color: var(--color-primary);
        font-weight: 700;
      }
    }

    /* Rejected state */
    .step-item.rejected {
      .step-marker {
        background: var(--color-danger-bg, #fee2e2);
        border-color: var(--color-danger, #dc2626);
        color: var(--color-danger, #dc2626);
      }
      .step-title {
        color: var(--color-danger, #dc2626);
      }
    }
  `]
})
export class ApplicationTimelineComponent {
  @Input({ required: true }) status!: ApplicationStatus | string;
  @Input() submittedAt?: string;
  @Input() assessedAt?: string;
  @Input() rejectionReason?: string;

  steps: TimelineStep[] = [
    { key: 'SUBMITTED', title: 'Submitted', subtitle: 'Application Received', icon: 'send' },
    { key: 'UNDER_REVIEW', title: 'Under Review', subtitle: 'Document & KYC Check', icon: 'manage_search' },
    { key: 'CREDIT_ASSESSED', title: 'Credit Assessed', subtitle: 'Risk & Affordability', icon: 'analytics' },
    { key: 'APPROVED', title: 'Decision', subtitle: 'Approved & Ready', icon: 'check_circle' }
  ];

  get isRejected(): boolean {
    return this.status === ApplicationStatus.REJECTED;
  }

  get currentStepIndex(): number {
    switch (this.status) {
      case ApplicationStatus.DRAFT:
      case ApplicationStatus.SUBMITTED:
        return 0;
      case ApplicationStatus.UNDER_REVIEW:
        return 1;
      case ApplicationStatus.CREDIT_ASSESSED:
        return 2;
      case ApplicationStatus.APPROVED:
      case ApplicationStatus.REJECTED:
        return 3;
      default:
        return 0;
    }
  }

  isStepCompleted(index: number): boolean {
    return index < this.currentStepIndex || (index === 3 && this.status === ApplicationStatus.APPROVED);
  }

  isStepCurrent(index: number): boolean {
    return index === this.currentStepIndex;
  }

  getStepIcon(step: TimelineStep, index: number): string {
    if (this.isStepCompleted(index)) return 'check';
    if (index === 3 && this.isRejected) return 'cancel';
    return step.icon;
  }

  getStepSubtitle(step: TimelineStep, index: number): string {
    if (index === 0 && this.submittedAt) return 'Completed';
    if (index === 3 && this.isRejected) return 'Application Rejected';
    return step.subtitle;
  }
}
