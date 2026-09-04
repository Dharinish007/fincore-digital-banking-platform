import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Observable } from "rxjs";

import { FaceMatchService } from "../../services/face-match.service";
import {
  FaceMatchResult,
  FaceSourceImage,
} from "../../models/face-match.model";

import { FaceComparisonCardComponent } from "./components/face-comparison-card/face-comparison-card.component";

@Component({
  selector: "app-face-match",
  standalone: true,
  imports: [CommonModule, MatIconModule, FaceComparisonCardComponent],
  templateUrl: "./face-match.component.html",
  styleUrls: ["./face-match.component.scss"],
})
export class FaceMatchComponent implements OnInit {
  private faceMatchService = inject(FaceMatchService);
  public result$!: Observable<FaceMatchResult>;
  public sourceImages$!: Observable<FaceSourceImage>;
  public isComparing$!: Observable<boolean>;
  public currentIdFile: File | null = null;
  public currentSelfieFile: File | null = null;

  ngOnInit(): void {
    this.result$ = this.faceMatchService.result$;
    this.sourceImages$ = this.faceMatchService.sourceImages$;
    this.isComparing$ = this.faceMatchService.isComparing$;
  }

  onIdFileChange(file: File | null): void {
    this.currentIdFile = file;
  }

  onSelfieFileChange(file: File | null): void {
    this.currentSelfieFile = file;
  }

  onCompareFaces(payload: { idFile: File; selfieFile: File }): void {
    this.currentIdFile = payload.idFile;
    this.currentSelfieFile = payload.selfieFile;
    this.faceMatchService
      .compareFaces(payload.idFile, payload.selfieFile)
      .subscribe();
  }

  onRetry(): void {
    if (this.currentIdFile && this.currentSelfieFile) {
      this.faceMatchService
        .compareFaces(this.currentIdFile, this.currentSelfieFile)
        .subscribe();
    } else {
      this.faceMatchService.triggerReanalysis("VERIFIED");
    }
  }
}
