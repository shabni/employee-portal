import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../chat.service';
import { SessionService } from '../../core/session.service';

@Component({ selector: 'app-chat', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './chat.component.html' })
export class ChatComponent implements OnInit, OnDestroy {
  private readonly chat=inject(ChatService);readonly session=inject(SessionService);messages:any[]=[];text='';users=0;private socket:any;
  ngOnInit():void{this.socket=this.chat.connect();this.socket.on('users',(count:number)=>this.users=count);this.socket.on('chat',(message:any)=>this.messages.push(message));}
  send():void{const content=this.text.trim();if(!content)return;const message={text:content,username:this.session.profile?.firstName||'Employee',at:Date.now()};this.socket.emit('chat',message);this.messages.push(message);this.text='';}
  ngOnDestroy():void{this.socket?.off('users');this.socket?.off('chat');}
}
