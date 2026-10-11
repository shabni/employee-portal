import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PortalApiService } from '../../portal-api.service';

@Component({ selector: 'app-employees', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './employees.component.html' })
export class EmployeesComponent implements OnInit {
  private readonly api=inject(PortalApiService);private readonly route=inject(ActivatedRoute);employees:any[]=[];roles:any[]=[];leads:any[]=[];form:any={};search='';editing:string|null=null;detail:any=null;message='';busy=false;formOpen=false;
  get setupMode():boolean{return this.route.snapshot.routeConfig?.path==='setup/employees'}get filtered():any[]{return this.employees.filter(e=>`${e.firstName} ${e.lastName} ${e.username} ${e.officeEmail}`.toLowerCase().includes(this.search.toLowerCase()));}
  async ngOnInit():Promise<void>{await this.load();if(this.setupMode)this.begin();}
  async load():Promise<void>{try{const [employees,roles]=await Promise.all([firstValueFrom(this.api.employees()),firstValueFrom(this.api.roles())]);this.employees=employees.map(e=>this.normalize(e));this.roles=roles;}catch{this.employees=[];this.roles=[];}}
  private normalize(e:any):any{return {...e,id:e.userId??e.id,firstName:e.fName??e.firstName,lastName:e.lName??e.lastName,username:e.userName??e.username,officeEmail:e.emailOffice??e.officeEmail,phoneNumber:e.phone??e.phoneNumber,nationalId:e.nic??e.nationalId,roleId:e.roleId,joiningDate:e.joiningDate?new Date(Number(e.joiningDate)<100000000000?Number(e.joiningDate)*1000:Number(e.joiningDate)).toISOString().slice(0,10):'',teamLeadId:e.teamLeadId};}
  begin():void{this.form={};this.editing=null;this.detail=null;this.formOpen=true;}
  async roleChanged():Promise<void>{this.leads=this.form.roleId?(await firstValueFrom(this.api.teamLeads(String(this.form.roleId)))).map((lead:any)=>({...lead,id:lead.userId??lead.id,firstName:lead.fName??lead.firstName,lastName:lead.lName??lead.lastName})):[];if(this.form.teamLeadId&&!this.leads.some(lead=>String(lead.id)===String(this.form.teamLeadId)))this.form.teamLeadId='';}
  async save():Promise<void>{this.busy=true;this.message='';try{const data:any={fName:this.form.firstName,lName:this.form.lastName,userName:this.form.username,password:this.form.password,joiningDate:Math.floor(new Date(`${this.form.joiningDate}T00:00:00`).getTime()/1000),phone:Number(this.form.phoneNumber),nic:this.form.nationalId,emailOffice:this.form.officeEmail,roleId:this.form.roleId||undefined,address:this.form.address,profileImage:this.form.profileImage,designation:this.form.designation,teamLeadId:this.form.teamLeadId||null};if(this.editing&&!data.password)delete data.password;if(this.editing)await firstValueFrom(this.api.updateEmployee(this.editing,data));else await firstValueFrom(this.api.createEmployee(data));this.message=this.editing?'Employee updated.':'Employee created.';this.begin();await this.load();}catch{this.message='Could not save employee. Check required fields, role level and username uniqueness.';}finally{this.busy=false;}}
  edit(e:any):void{this.detail=null;this.formOpen=true;this.editing=String(e.id);this.form={...e,password:'',teamLeadId:e.teamLeadId||''};void this.roleChanged();}
  async show(e:any):Promise<void>{try{this.detail=this.normalize(await firstValueFrom(this.api.employee(String(e.id))));}catch{this.detail=e;}}
  async upload(event:Event):Promise<void>{const f=(event.target as HTMLInputElement).files?.[0];if(!f)return;try{const r=await firstValueFrom(this.api.upload('profile',f));this.form.profileImage=r?.path??r?.filePath??r?.filename;}catch{this.message='Could not upload image.';}}
}
