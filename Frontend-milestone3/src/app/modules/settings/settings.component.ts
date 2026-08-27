import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
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

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
