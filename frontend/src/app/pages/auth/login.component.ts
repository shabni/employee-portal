import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/session.service';

@Component({ selector: 'app-login', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginComponent {
  private readonly session = inject(SessionService); private readonly router = inject(Router);
  username = ''; password = ''; busy = false; error = '';
  async submit(): Promise<void> { this.busy = true; this.error = ''; try { await this.session.signIn({ userName: this.username, password: this.password }); await this.router.navigate(['/workspace/overview']); } catch { this.error = 'We could not sign you in. Check your credentials and try again.'; } finally { this.busy = false; } }
}
