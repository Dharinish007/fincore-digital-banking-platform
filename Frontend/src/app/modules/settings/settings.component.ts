import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { AccountService } from '../../services/account.service';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
  readonly accountService = inject(AccountService);
  readonly authService = inject(AdminAuthService);

  sagaTimeoutSeconds = 30;
  fraudThresholdInr = 500000;
  kafkaBrokers = 'kafka-node-1.fincore.internal:9092, kafka-node-2.fincore.internal:9092';
  maxRetries = 3;
  currencySymbol = '₹ (INR - Indian Rupee)';
  autoDebitWindow = '06:00 IST';

  toastMessage: string | null = null;

  saveSettings(): void {
    this.showToast('FinCore System Configuration & Saga Parameters saved successfully.');
  }

  toggleTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
