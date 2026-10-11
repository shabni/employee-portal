import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PortalApiService } from '../../portal-api.service';

@Component({ selector: 'app-roles', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './roles.component.html' })
export class RolesComponent implements OnInit {
  private readonly api=inject(PortalApiService);private readonly route=inject(ActivatedRoute);roles:any[]=[];form:any={};editing:string|null=null;message='';busy=false;formOpen=false;readonly permissionChoices=['useTasks','submitReports','manageAttendance','viewTeam','viewReports','manageEmployees','manageRoles','manageTasks'];selected:string[]=[];
  get setupMode():boolean{return this.route.snapshot.routeConfig?.path==='setup/roles'}
  get configuredLevels():number[]{return [...new Set(this.roles.map(r=>Number(r.scale)))].sort((a,b)=>a-b)}
  readonly hierarchy=[
    {title:'Developer',scale:1,permissions:'useTasks,submitReports,manageAttendance'},{title:'QA',scale:1,permissions:'useTasks,submitReports,manageAttendance'},
    {title:'Team Lead',scale:2,permissions:'useTasks,submitReports,manageAttendance,viewTeam,viewReports'},
    {title:'Manager',scale:3,permissions:'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees'},
    {title:'Director',scale:4,permissions:'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees,manageRoles'},
    {title:'Executive',scale:5,permissions:'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees,manageRoles,manageTasks'}
  ];
  async ngOnInit():Promise<void>{await this.load();if(this.setupMode)this.begin();}
  async load():Promise<void>{try{this.roles=await firstValueFrom(this.api.roles())??[];}catch{this.roles=[];}}
  async addHierarchy():Promise<void>{this.busy=true;let added=0;try{for(const role of this.hierarchy){if(this.roles.some(r=>String(r.title).toLowerCase()===role.title.toLowerCase()))continue;await firstValueFrom(this.api.createRole(role));added++;}await this.load();this.message=added?`Added ${added} roles to the five-level hierarchy.`:'The suggested hierarchy is already configured.';}catch{await this.load();this.message='Some roles could not be created. Review existing role titles and try again.';}finally{this.busy=false;}}
  begin():void{this.form={scale:1};this.selected=[];this.editing=null;this.formOpen=true;}
  edit(role:any):void{this.formOpen=true;this.form={...role};this.editing=String(role.roleId??role.id);this.selected=(Array.isArray(role.permissions)?role.permissions:String(role.permissions||'').split(',')).map((x:string)=>x.trim()).filter(Boolean);}
  toggle(permission:string,event:Event):void{const checked=(event.target as HTMLInputElement).checked;this.selected=checked?[...this.selected,permission]:this.selected.filter(p=>p!==permission);}
  async save():Promise<void>{this.busy=true;try{const data={title:this.form.title,scale:Number(this.form.scale),permissions:this.selected.join(',')};if(this.editing)await firstValueFrom(this.api.updateRole(this.editing,data));else await firstValueFrom(this.api.createRole(data));this.message=this.editing?'Role updated.':'Role created.';this.begin();await this.load();}catch{this.message='Could not save this role. Role titles must be unique.';}finally{this.busy=false;}}
}
