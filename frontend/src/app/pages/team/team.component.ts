import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate } from '../../core/date-time';

type TeamTab = 'members' | 'attendance' | 'reports' | 'progress';

@Component({ selector: 'app-team', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './team.component.html' })
export class TeamComponent implements OnInit {
  readonly session = inject(SessionService);
  private readonly api = inject(PortalApiService);
  members: any[] = [];
  rows: any[] = [];
  tab: TeamTab = 'members';
  date = this.defaultSeedDate();
  message = '';
  busy = false;

  get userId(): string { return String(this.session.profile?.userId); }

  async ngOnInit(): Promise<void> {
    try {
      const members = await firstValueFrom(this.api.teamMembers(this.userId)) ?? [];
      this.members = members.map((member: any) => this.normalizeMember(member));
      if (this.tab !== 'members') await this.loadData();
    } catch {
      this.message = 'Could not load team information.';
    }
  }

  async changeTab(tab: TeamTab): Promise<void> {
    this.tab = tab;
    this.message = '';
    if (tab !== 'members') await this.loadData();
  }

  async loadData(): Promise<void> {
    if (this.tab === 'members') return;
    this.busy = true;
    this.message = '';
    this.rows = [];
    const kind = { attendance: 'getTeamAttendence', reports: 'getTeamReports', progress: 'getTeamProgress' } as const;
    try {
      const timestamp = Math.floor(new Date(`${this.date}T00:00:00`).getTime() / 1000);
      const result = await firstValueFrom(this.api.teamData(kind[this.tab], this.userId, timestamp)) ?? [];
      this.rows = result.map((row: any) => this.normalizeRow(row));
    } catch {
      this.message = 'Could not retrieve team data for this date.';
    } finally {
      this.busy = false;
    }
  }

  formatDuration(value: number | null | undefined): string {
    if (value == null) return '-';
    const minutes = Math.floor(Number(value) / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  }

  private normalizeMember(member: any): any {
    return {
      ...member,
      firstName: member.fName ?? member.firstName ?? '',
      lastName: member.lName ?? member.lastName ?? '',
      username: member.userName ?? member.username ?? '',
      officeEmail: member.emailOffice ?? member.officeEmail ?? '',
    };
  }

  private normalizeRow(row: any): any {
    const user = row.user ?? row;
    return {
      ...row,
      firstName: row.fName ?? row.firstName ?? user.fName ?? user.firstName ?? '',
      lastName: row.lName ?? row.lastName ?? user.lName ?? user.lastName ?? '',
      taskTitle: row.task?.title ?? row.taskTitle ?? row.title ?? '',
      active: row.isActive ?? row.active ?? false,
      attendenceDate: asDate(row.attendenceDate),
      checkInTime: asDate(row.checkInTime),
      checkOutTime: asDate(row.checkOutTime),
      reportDate: asDate(row.reportDate),
    };
  }

  private defaultSeedDate(): string {
    const day = new Date();
    const seededDay = new Date(day.getFullYear(), day.getMonth(), 0);
    while (seededDay.getDay() === 0 || seededDay.getDay() === 6) seededDay.setDate(seededDay.getDate() - 1);
    const year = seededDay.getFullYear();
    const month = String(seededDay.getMonth() + 1).padStart(2, '0');
    const date = String(seededDay.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
}
