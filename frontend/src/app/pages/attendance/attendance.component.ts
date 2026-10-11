import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate, unixSeconds } from '../../core/date-time';

@Component({ selector: 'app-attendance', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './attendance.component.html' })
export class AttendanceComponent implements OnInit {
  readonly session=inject(SessionService);private readonly api=inject(PortalApiService);records:any[]=[];busy=false;message='';
  get checkedIn():boolean{return !!this.session.profile?.checkedIn} get userId():string{return String(this.session.profile?.userId)} get today():Date{return new Date()}
  async ngOnInit():Promise<void>{try{this.records=(await firstValueFrom(this.api.attendance(this.userId))??[]).map(r=>{const checkInTime=asDate(r.checkInTime);const checkOutTime=asDate(r.checkOutTime);return{...r,attendenceDate:asDate(r.attendenceDate),checkInTime,checkOutTime,durationText:this.formatDuration(checkInTime,checkOutTime)};});}catch{this.records=[];}}
  private formatDuration(checkInTime:Date|null,checkOutTime:Date|null):string{if(!checkInTime||!checkOutTime)return'--';const totalMinutes=Math.max(0,Math.floor((checkOutTime.getTime()-checkInTime.getTime())/60000));const hours=Math.floor(totalMinutes/60);const minutes=totalMinutes%60;return`${hours}h ${minutes}m`;}
  async action(kind:'in'|'out'):Promise<void>{this.busy=true;this.message='';const d=new Date();const payload={userId:this.userId,attendenceDate:unixSeconds(new Date(d.getFullYear(),d.getMonth(),d.getDate())),[kind==='in'?'checkInTime':'checkOutTime']:unixSeconds(d)};try{await firstValueFrom(kind==='in'?this.api.checkIn(payload):this.api.checkOut(payload));this.message=kind==='in'?'Check-in recorded.':'Check-out recorded.';await this.ngOnInit();}catch{this.message=kind==='in'?'Unable to check in.':'No matching check-in was found.';}finally{this.busy=false;}}
}
