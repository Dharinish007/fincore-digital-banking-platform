import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  readonly isPreviewModalOpen = signal<boolean>(false);
  readonly isEmailModalOpen = signal<boolean>(false);
  readonly isTransferModalOpen = signal<boolean>(false);
  readonly editingAccountId = signal<string | null>(null);

  openPreviewModal(): void {
    this.isPreviewModalOpen.set(true);
  }

  closePreviewModal(): void {
    this.isPreviewModalOpen.set(false);
  }

  openEmailModal(): void {
    this.isEmailModalOpen.set(true);
  }

  closeEmailModal(): void {
    this.isEmailModalOpen.set(false);
  }

  openTransferModal(): void {
    this.isTransferModalOpen.set(true);
  }

  closeTransferModal(): void {
    this.isTransferModalOpen.set(false);
  }

  openEditAccountModal(accountId: string): void {
    this.editingAccountId.set(accountId);
  }

  closeEditAccountModal(): void {
    this.editingAccountId.set(null);
  }
}

