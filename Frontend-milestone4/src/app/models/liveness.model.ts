export interface LivenessVerification {
  customerId: string;
  verificationId: string;
  status: 'PENDING' | 'VERIFYING' | 'SUCCESS' | 'FAILED';
  score: number;
  verificationTime: string;
  failureReason?: string;
}

export interface LivenessChallenge {
  id: 'blink' | 'turn_head' | 'smile';
  label: string;
  instruction: string;
  completed: boolean;
  active: boolean;
}
