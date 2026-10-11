import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '../core/session.service';

@Component({ selector: 'app-workspace', standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet], templateUrl: './workspace.component.html' })
export class WorkspaceComponent {
  readonly session = inject(SessionService);
  private readonly router = inject(Router);
  menuOpen = false;
  readonly primaryLinks = [
    { label: 'Overview', route: 'overview' }, { label: 'My Profile', route: 'profile' },
    { label: 'Attendance', route: 'attendance' }, { label: 'Tasks', route: 'tasks' },
    { label: 'Reports', route: 'reports' }, { label: 'My Team', route: 'team' },
    { label: 'Employees', route: 'employees' }, { label: 'Roles & Permissions', route: 'roles' }, { label: 'Chat', route: 'chat' }
  ];
  get pageTitle(): string { const leaf = this.router.url.split('/').filter(Boolean).at(-1) ?? 'overview'; return ({ overview: 'Overview', profile: 'My Profile', attendance: 'Attendance', tasks: 'Tasks', reports: 'Reports', team: 'My Team', employees: 'Employees', roles: 'Roles & Permissions', chat: 'Chat' } as Record<string, string>)[leaf] ?? 'Overview'; }
  get initials(): string { const p = this.session.profile; return `${p?.firstName?.[0] ?? ''}${p?.lastName?.[0] ?? ''}` || 'EP'; }
  async signOut(): Promise<void> { await this.session.signOut(); await this.router.navigate(['/']); }
  @HostListener('document:keydown.escape') closeMenu(): void { this.menuOpen = false; }
}
