import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate, unixSeconds } from '../../core/date-time';

@Component({ selector: 'app-reports', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './reports.component.html' })
export class ReportsComponent implements OnInit {
  readonly session=inject(SessionService);private readonly api=inject(PortalApiService); reports:any[]=[];reportDate=new Date().toISOString().slice(0,10);description='';editing:any=null;message='';busy=false;
  get userId():string{return String(this.session.profile?.userId)}
  async ngOnInit():Promise<void>{try{this.reports=(await firstValueFrom(this.api.reports(this.userId))??[]).map(r=>({...r,reportDate:asDate(r.reportDate),updatedAt:asDate(r.updatedAt)}));}catch{this.message='Could not load reports.';}}
  edit(report:any):void{this.editing=report;this.reportDate=(asDate(report.reportDate)??new Date()).toISOString().slice(0,10);this.description=report.description;}
  reset():void{this.editing=null;this.description='';this.reportDate=new Date().toISOString().slice(0,10);}
  async save():Promise<void>{this.busy=true;this.message='';const payload={userId:this.userId,reportDate:unixSeconds(new Date(`${this.reportDate}T00:00:00`)),description:this.description};try{if(this.editing)await firstValueFrom(this.api.updateReport(String(this.editing.reportId??this.editing.id),payload));else await firstValueFrom(this.api.createReport(payload));this.message=this.editing?'Report updated.':'Report submitted.';this.reset();await this.ngOnInit();}catch{this.message='Could not save this report.';}finally{this.busy=false;}}
}
