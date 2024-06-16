import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CardsService } from '../../cards/services/cards.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public messages: { name: string; message: string }[] = [];
  public message: string = '';
  private socket!: Socket;

  constructor( private cardService: CardsService ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.socket = io('http://localhost:3005', {
        extraHeaders: {
          authentication: token
        }
      });
    } else {
      console.error('No JWT token found in local storage');
    }
  }

  ngOnInit(): void {
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('message-from-server', (payload: { name: string; message: string }) => {
        this.messages.push(payload);
      });

      this.socket.on('all-messages', (messages: { name: string; message: string }[]) => {
        this.messages = messages;
      });
      
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(): void {
    if (this.message.trim().length === 0) {
      return;
    }

    if (this.socket) {
      this.socket.emit('message-from-client', {
        message: this.message
      });

      this.message = '';
    }
  }

  openChat(): void {
    this.cardService.isOpen = true;
  }

  closeChat(): void {
    this.cardService.isOpen = false;
  }

  get isOpen(): boolean {
    return this.cardService.isOpen
  }
}
