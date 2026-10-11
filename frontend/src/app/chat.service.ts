import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket?: Socket;
  connect(): Socket {
    if (!this.socket) this.socket = io('http://localhost:3000');
    return this.socket;
  }
  disconnect(): void { this.socket?.disconnect(); this.socket = undefined; }
}
