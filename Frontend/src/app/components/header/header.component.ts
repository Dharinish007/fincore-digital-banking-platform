import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AccountService } from '../../services/account.service';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly accountService = inject(AccountService);
  readonly authService = inject(AdminAuthService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMasking(): void {
    this.accountService.toggleDataMasking();
  }
}

