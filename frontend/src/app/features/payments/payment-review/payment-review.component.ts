import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { HeaderComponent } from "../components/header/header.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

export interface PaymentReviewData {
  payment_id: string;
  from_account_no: string;
  beneficiary_name: string;
  to_account_no: string;
  amount: number;
  payment_type: string;
  payment_mode: string;
  remarks: string;
  payment_status: "Pending" | "Processing" | "Success" | "Failed" | "Cancelled";
}

@Component({
  selector: "app-payment-review",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: "./payment-review.component.html",
  styleUrls: ["./payment-review.component.scss"],
})
export class PaymentReviewComponent implements OnInit {
  sidebarCollapsed = false;

  reviewData: PaymentReviewData | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    console.log("Review page state:", state);

    if (!state || !state.payment) {
      console.error("No payment data received");
      return;
    }

    const p = state.payment;

    this.reviewData = {
      payment_id: String(p.payment_id),

      from_account_no: String(p.from_account_no),

      beneficiary_name: String(p.beneficiary_name),

      to_account_no: String(p.to_account_no),

      amount: Number(p.amount),

      payment_type: String(p.payment_type),

      payment_mode: String(p.payment_mode),

      remarks: p.description || p.remarks || "",

      // IMPORTANT:
      // Take the status returned from backend.
      payment_status: p.payment_status,
    };

    console.log("Payment review data:", this.reviewData);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
