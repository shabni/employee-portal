import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate } from '../../core/date-time';

@Component({ selector: 'app-tasks', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './tasks.component.html' })
export class TasksComponent implements OnInit {
  readonly session=inject(SessionService);private readonly api=inject(PortalApiService);tasks:any[]=[];active:any=null;subtasks:any[]=[];selected:any=null;title='';description='';newSubtask='';editing:any=null;message='';busy=false;
  get userId():string{return String(this.session.profile?.userId??'')}get isSignedIn():boolean{return this.session.isAuthenticated}
  async ngOnInit():Promise<void>{try{this.tasks=await firstValueFrom(this.api.tasks())??[];if(this.isSignedIn){const active=await firstValueFrom(this.api.activeTask(this.userId));this.active=active?.taskTrackId?{...active,startDate:asDate(active.startDate)}:null;}}catch{this.message='Could not load tasks.';}}
  async saveTask():Promise<void>{this.busy=true;try{const p={title:this.title,description:this.description};if(this.editing)await firstValueFrom(this.api.updateTask(String(this.editing.id),p));else await firstValueFrom(this.api.createTask(p));this.title='';this.description='';this.editing=null;this.message='Task saved.';await this.ngOnInit();}catch{this.message='Could not save task.';}finally{this.busy=false;}}
  async select(task:any):Promise<void>{this.selected=task;this.subtasks=await firstValueFrom(this.api.subtasks(String(task.id)))??[];}
  async addSubtask():Promise<void>{if(!this.newSubtask.trim()||!this.selected)return;try{await firstValueFrom(this.api.saveSubtasks([{title:this.newSubtask,taskId:this.selected.id}]));this.newSubtask='';await this.select(this.selected);}catch{this.message='Could not add subtask.';}}
  async start(task:any):Promise<void>{try{await firstValueFrom(this.api.startTask({userId:this.userId,taskId:task.id,startTime:Date.now()}));this.message=`Started ${task.title}.`;await this.ngOnInit();}catch{this.message='Could not start this task.';}}
  async stop():Promise<void>{try{await firstValueFrom(this.api.stopTask(String(this.active?.id??this.active?.taskTrackId)));this.message='Task timer stopped.';await this.ngOnInit();}catch{this.message='Could not stop the active timer.';}}
}
