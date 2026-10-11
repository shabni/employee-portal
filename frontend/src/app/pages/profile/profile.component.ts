import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../core/session.service';
import { PortalApiService } from '../../portal-api.service';
import { asDate, unixSeconds } from '../../core/date-time';

@Component({ selector: 'app-profile', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './profile.component.html' })
export class ProfileComponent implements OnInit {
  readonly session=inject(SessionService);private readonly api=inject(PortalApiService); profile:any={};busy=false;message='';
  async ngOnInit():Promise<void>{try{const raw=await firstValueFrom(this.api.employee(String(this.session.profile?.userId)));this.profile={...raw,firstName:raw.fName,lastName:raw.lName,username:raw.userName,officeEmail:raw.emailOffice,phoneNumber:raw.phone,nationalId:raw.nic,joiningDate:(asDate(raw.joiningDate)??new Date()).toISOString().slice(0,10)};}catch{this.profile={...this.session.profile};}}
  async save():Promise<void>{this.busy=true;this.message='';try{const payload={fName:this.profile.firstName,lName:this.profile.lastName,emailOffice:this.profile.officeEmail,phone:Number(this.profile.phoneNumber),nic:this.profile.nationalId,designation:this.profile.designation,address:this.profile.address,profileImage:this.profile.profileImage,joiningDate:unixSeconds(new Date(`${this.profile.joiningDate}T00:00:00`))};const result=await firstValueFrom(this.api.updateEmployee(String(this.session.profile?.userId),payload));this.profile={...this.profile,...result};this.session.updateProfile({firstName:this.profile.firstName,lastName:this.profile.lastName,officeEmail:this.profile.officeEmail,phoneNumber:this.profile.phoneNumber,nationalId:this.profile.nationalId,designation:this.profile.designation,address:this.profile.address,profileImage:this.profile.profileImage});this.message='Profile saved successfully.';}catch{this.message='Could not save profile changes.';}finally{this.busy=false;}}
  async upload(event:Event):Promise<void>{const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;try{const result=await firstValueFrom(this.api.upload('profile',file));this.profile.profileImage=result?.path??result?.filePath??result?.filename??'';this.message='Photo uploaded. Save your profile to apply it.';}catch{this.message='Photo upload failed.';}}
}
