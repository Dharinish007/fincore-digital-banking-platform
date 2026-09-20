import { Injectable } from '@angular/core';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface LandmarkChallengeState {
  faceCount: number;
  blink: boolean;
  headTurnLeft: boolean;
  smile: boolean;
}

@Injectable({ providedIn: 'root' })
export class FaceDetectionService {
  private landmarker: FaceLandmarker | null = null;
  private loading: Promise<void> | null = null;
  private eyesWereClosed = false;

  async initialize(): Promise<void> {
    if (this.landmarker) return;
    if (!this.loading) {
      this.loading = FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
      ).then(fileset => FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
        },
        runningMode: 'VIDEO',
        numFaces: 2,
        minFaceDetectionConfidence: 0.6,
        minFacePresenceConfidence: 0.6,
        minTrackingConfidence: 0.6
      })).then(landmarker => { this.landmarker = landmarker; });
    }
    await this.loading;
  }

  detect(video: HTMLVideoElement): LandmarkChallengeState {
    if (!this.landmarker) return { faceCount: 0, blink: false, headTurnLeft: false, smile: false };
    const result = this.landmarker.detectForVideo(video, performance.now());
    const landmarks = result.faceLandmarks;
    if (landmarks.length !== 1) return { faceCount: landmarks.length, blink: false, headTurnLeft: false, smile: false };
    const face = landmarks[0];
    const leftEye = this.eyeAspectRatio(face, [33, 160, 158, 133, 153, 144]);
    const rightEye = this.eyeAspectRatio(face, [362, 385, 387, 263, 373, 380]);
    const eyesClosed = (leftEye + rightEye) / 2 < 0.22;
    const blink = this.eyesWereClosed && !eyesClosed;
    this.eyesWereClosed = eyesClosed;
    const eyeDistance = Math.abs(face[33].x - face[263].x);
    const nosePosition = (face[1].x - face[263].x) / eyeDistance;
    const mouthWidth = Math.abs(face[61].x - face[291].x) / eyeDistance;
    const mouthHeight = Math.abs(face[13].y - face[14].y) / eyeDistance;
    return {
      faceCount: 1,
      blink,
      headTurnLeft: nosePosition < 0.35,
      smile: mouthWidth > 0.9 && mouthHeight > 0.12
    };
  }

  reset(): void {
    this.eyesWereClosed = false;
  }

  private eyeAspectRatio(face: { x: number; y: number }[], points: number[]): number {
    const verticalOne = this.distance(face[points[1]], face[points[5]]);
    const verticalTwo = this.distance(face[points[2]], face[points[4]]);
    const horizontal = this.distance(face[points[0]], face[points[3]]);
    return (verticalOne + verticalTwo) / (2 * horizontal);
  }

  private distance(first: { x: number; y: number }, second: { x: number; y: number }): number {
    return Math.hypot(first.x - second.x, first.y - second.y);
  }
}
