export type DocumentStatus = 'Pending' | 'Submitted' | 'Verified' | 'Rejected';

export interface DocumentUpload {
  label: string;
  status: DocumentStatus;
}
