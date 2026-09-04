import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "document-ocr",
    pathMatch: "full",
  },
  {
    path: "document-ocr",
    loadComponent: () =>
      import("./features/document-ocr/document-ocr.component").then(
        (m) => m.DocumentOcrComponent,
      ),
    title: "Document OCR — FinCore Nexus",
  },
  {
    path: "liveness-detection",
    loadComponent: () =>
      import("./features/liveness-detection/liveness-detection.component").then(
        (m) => m.LivenessDetectionComponent,
      ),
    title: "Liveness Detection — FinCore Nexus",
  },
  {
    path: "face-match",
    loadComponent: () =>
      import("./pages/face-match/face-match.component").then(
        (m) => m.FaceMatchComponent,
      ),
    title: "Face Match Accuracy — FinCore Nexus",
  },
  {
    path: "verification-summary",
    loadComponent: () =>
      import("./pages/verification-summary/verification-summary.component").then(
        (m) => m.VerificationSummaryComponent,
      ),
    title: "Verification Summary — FinCore Nexus",
  },
  {
    path: "**",
    redirectTo: "face-match",
  },
];
