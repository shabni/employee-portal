import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate, unixSeconds } from '../../core/date-time';

@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit {
  readonly session = inject(SessionService); private readonly api = inject(PortalApiService);
  attendance: any[] = []; reports: any[] = []; tasks: any[] = []; activeTask: any = null; busy = false; message = '';
  get userId(): string { return String(this.session.profile?.userId ?? ''); }
  get today(): Date { return new Date(); }
  async ngOnInit(): Promise<void> { try { const [attendance,reports,tasks,active] = await Promise.all([firstValueFrom(this.api.attendance(this.userId)),firstValueFrom(this.api.reports(this.userId)),firstValueFrom(this.api.tasks()),firstValueFrom(this.api.activeTask(this.userId))]); this.attendance=(attendance??[]).map(r=>({...r,attendenceDate:asDate(r.attendenceDate),checkInTime:asDate(r.checkInTime),checkOutTime:asDate(r.checkOutTime)}));this.reports=(reports??[]).slice(0,3).map(r=>({...r,reportDate:asDate(r.reportDate),updatedAt:asDate(r.updatedAt)}));this.tasks=tasks??[];this.activeTask=active?.taskTrackId?{...active,startDate:asDate(active.startDate)}:null; } catch { this.message='Some dashboard information could not be loaded.'; } }
  async checkIn(): Promise<void> { this.busy=true; try { const now=new Date(); const attendenceDate=unixSeconds(new Date(now.getFullYear(),now.getMonth(),now.getDate())); await firstValueFrom(this.api.checkIn({userId:this.userId,attendenceDate,checkInTime:unixSeconds(now)})); this.message='You are checked in for today.'; await this.ngOnInit(); } catch { this.message='Could not check in. You may already be checked in.'; } finally { this.busy=false; } }
  async checkOut(): Promise<void> { this.busy=true; try { const now=new Date(); const attendenceDate=unixSeconds(new Date(now.getFullYear(),now.getMonth(),now.getDate())); await firstValueFrom(this.api.checkOut({userId:this.userId,attendenceDate,checkOutTime:unixSeconds(now)})); this.message='You are checked out for today.'; await this.ngOnInit(); } catch { this.message='Could not check out. Check that you have checked in today.'; } finally { this.busy=false; } }
  get checkedIn(): boolean { return !!this.session.profile?.checkedIn; }
}
