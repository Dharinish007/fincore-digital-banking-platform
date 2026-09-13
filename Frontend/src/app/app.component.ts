import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatementPreviewModalComponent } from './components/statement-preview-modal/statement-preview-modal';
import { EmailModalComponent } from './components/email-modal/email-modal';
import { EditAccountModalComponent } from './components/edit-account-modal/edit-account-modal';
import { TransferModalComponent } from './components/transfer-modal/transfer-modal';
import { ModalService } from './services/modal.service';
import { DeliveryStorageService } from './services/delivery-storage.service';
import { ThemeService } from './services/theme.service';

import { AdminLoginComponent } from './modules/admin-login/admin-login.component';
import { AdminAuthService } from './services/admin-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminLoginComponent,
    HeaderComponent,
    SidebarComponent,
    StatementPreviewModalComponent,
    EmailModalComponent,
    EditAccountModalComponent,
    TransferModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly authService = inject(AdminAuthService);
  readonly modalService = inject(ModalService);
  readonly deliveryService = inject(DeliveryStorageService);
  readonly themeService = inject(ThemeService);
}

