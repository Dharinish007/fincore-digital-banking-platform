import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import {
  PaymentInitiationService,
  UserAccount,
} from "./payment-initiation.service";

import { Beneficiary } from "./models/beneficiary.model";
import { Payment } from "./models/payment.model";
import { FraudCheck } from "./models/fraud-check.model";

import { HeaderComponent } from "../components/header/header.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";

export type FlowStep = "FORM" | "REVIEW" | "PROCESSING" | "SUCCESS";

@Component({
  selector: "app-payment-initiation",
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],

  templateUrl: "./payment-initiation.component.html",
  styleUrls: ["./payment-initiation.component.scss"],
})
export class PaymentInitiationComponent implements OnInit {
  sidebarCollapsed = false;

  currentStep: FlowStep = "FORM";

  // Data from backend
  accounts: UserAccount[] = [];

  allBeneficiaries: Beneficiary[] = [];

  verifiedBeneficiaries: Beneficiary[] = [];

  nonVerifiedBeneficiaries: Beneficiary[] = [];

  // Selected beneficiary
  selectedBeneficiary: Beneficiary | null = null;

  // Payment form
  paymentForm!: FormGroup;

  // Processing
  isSubmitting = false;

  processingStage = "";

  // Backend response
  completedPayment: Payment | null = null;

  fraudCheckResult: FraudCheck | null = null;

  paymentTypes: ("Transfer" | "Bill Payment" | "Other")[] = [
    "Transfer",
    "Bill Payment",
    "Other",
  ];

  paymentModes: ("IMPS" | "NEFT" | "RTGS" | "UPI")[] = [
    "IMPS",
    "NEFT",
    "RTGS",
    "UPI",
  ];

  /*
   * For now customer ID = 1.
   *
   * Later replace this with the ID
   * of the logged-in customer.
   */
  customerId = 1;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentInitiationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

    // First load beneficiaries from backend
    this.paymentService.loadBeneficiaries();

    // Then load accounts and beneficiaries
    this.loadInitialData();
  }
  /*
   * Create payment form
   *
   * payment_id is NOT created in Angular.
   * Backend/database should generate it.
   */
  private initForm(): void {
    this.paymentForm = this.fb.group({
      payment_id: [null],
      from_account_no: ["", [Validators.required]],

      beneficiary_id: ["", [Validators.required]],

      to_account_no: ["", [Validators.required]],

      amount: [null, [Validators.required, Validators.min(0.01)]],

      payment_type: ["Transfer", [Validators.required]],

      payment_mode: ["IMPS", [Validators.required]],

      description: [""],
    });

    /*
     * When beneficiary changes,
     * automatically select destination account.
     */
    this.paymentForm
      .get("beneficiary_id")
      ?.valueChanges.subscribe((beneficiaryId) => {
        this.onBeneficiarySelect(Number(beneficiaryId));
      });
  }

  /*
   * Load accounts and beneficiaries
   * from Spring Boot backend.
   */
  private loadInitialData(): void {
    const customerId = 1;

    // =========================
    // LOAD ACCOUNTS FROM DB
    // =========================

    this.paymentService.getAccounts(customerId).subscribe({
      next: (accounts) => {
        console.log("Accounts loaded from DB:", accounts);

        this.accounts = accounts;

        if (this.accounts.length > 0) {
          this.paymentForm.patchValue({
            from_account_no: this.accounts[0].account_no,
          });
        }
      },

      error: (error) => {
        console.error("Error loading accounts:", error);
      },
    });

    // =========================
    // LOAD BENEFICIARIES FROM DB
    // =========================

    this.paymentService.getBeneficiaries().subscribe({
      next: (beneficiaries) => {
        console.log("Beneficiaries loaded from DB:", beneficiaries);

        this.allBeneficiaries = beneficiaries;

        this.verifiedBeneficiaries = beneficiaries.filter(
          (b) => b.status === "Verified",
        );

        this.nonVerifiedBeneficiaries = beneficiaries.filter(
          (b) => b.status !== "Verified",
        );
      },

      error: (error) => {
        console.error("Error loading beneficiaries:", error);
      },
    });
  }

  /*
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /*
   * Select beneficiary
   */
  onBeneficiarySelect(beneficiaryId: number): void {
    /*
     * Nothing selected
     */
    if (!beneficiaryId) {
      this.selectedBeneficiary = null;

      this.paymentForm.patchValue({
        to_account_no: "",
      });

      return;
    }

    /*
     * Find beneficiary from backend data
     */
    const found = this.allBeneficiaries.find(
      (b) => b.beneficiary_id === beneficiaryId,
    );

    if (!found) {
      this.selectedBeneficiary = null;

      this.paymentForm.patchValue({
        to_account_no: "",
      });

      return;
    }

    /*
     * Only verified beneficiaries
     * can receive payments.
     */
    if (found.status !== "Verified") {
      this.selectedBeneficiary = null;

      this.paymentForm.patchValue({
        beneficiary_id: "",
        to_account_no: "",
      });

      alert("Only verified beneficiaries can be selected.");

      return;
    }

    /*
     * Store selected beneficiary
     */
    this.selectedBeneficiary = found;

    /*
     * Automatically populate
     * beneficiary account number.
     */
    this.paymentForm.patchValue({
      to_account_no: found.account_no,
    });
  }

  /*
   * Go to review page
   */
  goToReview(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.selectedBeneficiary) {
      alert("Please select a verified beneficiary.");
      return;
    }

    const formValues = this.paymentForm.value;

    // Do NOT send payment_id.
    // Backend/database generates it.
    const payload: Payment = {
      from_account_no: formValues.from_account_no,
      to_account_no: formValues.to_account_no,
      beneficiary_id: Number(formValues.beneficiary_id),
      amount: Number(formValues.amount),
      payment_type: formValues.payment_type,
      payment_mode: formValues.payment_mode,
      description: formValues.description
        ? formValues.description.trim()
        : undefined,
    };

    console.log("Creating payment:", payload);

    this.paymentService.initiatePayment(payload).subscribe({
      next: (response: Payment) => {
        console.log("Payment created successfully:", response);

        const reviewPayment = {
          payment_id: response.payment_id
            ? `PAY-${response.payment_id}`
            : "N/A",

          from_account_no: response.from_account_no,

          beneficiary_name: this.selectedBeneficiary?.beneficiary_name || "",

          to_account_no: response.to_account_no,

          amount: response.amount,

          payment_type: response.payment_type,

          payment_mode: response.payment_mode,

          remarks: response.description || "",

          payment_status: response.payment_status || "Processing",
        };

        console.log("Sending to review page:", reviewPayment);

        this.router.navigate(["/payment-review"], {
          state: {
            payment: reviewPayment,
          },
        });
      },

      error: (error: any) => {
        console.error("Unable to create payment:", error);

        if (error.error) {
          console.error("Backend error:", error.error);
        }

        alert("Unable to create payment. Please check the backend.");
      },
    });
  }

  /*
   * Return to payment form
   */
  editPayment(): void {
    this.currentStep = "FORM";
  }

  /*
   * Submit payment to Spring Boot
   */
  confirmPayment(): void {
    /*
     * Validate form
     */
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();

      return;
    }

    /*
     * Make sure beneficiary is selected
     */
    if (!this.selectedBeneficiary) {
      alert("Please select a verified beneficiary.");

      return;
    }

    /*
     * Start processing UI
     */
    this.currentStep = "PROCESSING";

    this.isSubmitting = true;

    this.processingStage = "Validating Account Balance & Sanction Screening...";

    /*
     * UI progress only.
     *
     * Actual payment processing
     * happens in Spring Boot.
     */
    setTimeout(() => {
      this.processingStage = "Running AI Fraud & Risk Analysis...";
    }, 600);

    setTimeout(() => {
      this.processingStage = "Executing Interbank Settlement Protocol...";
    }, 1100);

    const formValues = this.paymentForm.value;

    /*
     * Payment request.
     *
     * Backend generates:
     *
     * payment_id
     * transaction_ref
     * payment_status
     * initiated_at
     * updated_at
     */
    const payload: Payment = {
      from_account_no: formValues.from_account_no,

      to_account_no: formValues.to_account_no,

      beneficiary_id: Number(formValues.beneficiary_id),

      amount: Number(formValues.amount),

      payment_type: formValues.payment_type,

      payment_mode: formValues.payment_mode,

      description: formValues.description
        ? formValues.description.trim()
        : undefined,
    };

    console.log("Payment request:", payload);

    /*
     * POST:
     *
     * http://localhost:8080/api/payments
     */
    this.paymentService.initiatePayment(payload).subscribe({
      next: (response: any) => {
        console.log("Payment response:", response);

        /*
         * Store actual backend response
         */
        this.completedPayment = response;

        this.fraudCheckResult = null;

        this.isSubmitting = false;

        this.currentStep = "SUCCESS";
      },

      error: (error: any) => {
        console.error("Payment API error:", error);

        this.isSubmitting = false;

        this.currentStep = "FORM";

        alert("Payment processing failed. Please try again.");
      },
    });
  }

  /*
   * Reset form
   */
  resetForm(): void {
    this.currentStep = "FORM";

    this.completedPayment = null;

    this.fraudCheckResult = null;

    this.selectedBeneficiary = null;

    /*
     * Reset using backend account data.
     *
     * No mock account number.
     */
    this.paymentForm.reset({
      from_account_no:
        this.accounts.length > 0 ? this.accounts[0].account_no : "",

      beneficiary_id: "",

      to_account_no: "",

      amount: null,

      payment_type: "Transfer",

      payment_mode: "IMPS",

      description: "",
    });
  }

  /*
   * Form controls
   */
  get f() {
    return this.paymentForm.controls;
  }
}
