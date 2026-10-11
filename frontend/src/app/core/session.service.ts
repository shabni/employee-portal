import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PortalApiService } from '../portal-api.service';

export type PortalProfile = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api = inject(PortalApiService);
  private readonly profileSubject = new BehaviorSubject<PortalProfile | null>(null);
  readonly profile$ = this.profileSubject.asObservable();
  permissions: Record<string, boolean> = {};
  get profile(): PortalProfile | null { return this.profileSubject.value; }
  get isAuthenticated(): boolean { return !!this.profileSubject.value?.userId; }

  async restore(): Promise<void> {
    const token = sessionStorage.getItem('employee-portal-token');
    if (!token) return;
    try {
      const result = await firstValueFrom(this.api.session(token));
      this.accept(result);
    } catch {
      this.clear();
    }
  }

  async signIn(credentials: { userName: string; password: string }): Promise<void> {
    const result = await firstValueFrom(this.api.login(credentials));
    this.accept(result);
  }

  async signOut(): Promise<void> {
    const userId = this.profile?.userId;
    try { if (userId) await firstValueFrom(this.api.logout(userId)); }
    finally { this.clear(); }
  }

  updateProfile(profile: PortalProfile): void {
    this.profileSubject.next({ ...this.profile, ...profile });
  }

  private accept(result: any): void {
    const rawProfile = result?.profile;
    const profile = rawProfile ? {
      ...rawProfile,
      firstName: rawProfile.fName ?? rawProfile.firstName,
      lastName: rawProfile.lName ?? rawProfile.lastName,
      username: rawProfile.userName ?? rawProfile.username,
      officeEmail: rawProfile.emailOffice ?? rawProfile.officeEmail,
      phoneNumber: rawProfile.phone ?? rawProfile.phoneNumber,
      nationalId: rawProfile.nic ?? rawProfile.nationalId,
      checkedIn: rawProfile.isCheckedIn ?? rawProfile.checkedIn,
    } : null;
    if (!profile?.userId) { this.clear(); return; }
    const token = profile.token;
    if (token) sessionStorage.setItem('employee-portal-token', token);
    this.permissions = result.permissions || {};
    this.profileSubject.next(profile);
  }

  private clear(): void {
    sessionStorage.removeItem('employee-portal-token');
    this.permissions = {};
    this.profileSubject.next(null);
  }
}
