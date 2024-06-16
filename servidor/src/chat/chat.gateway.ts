import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true }) // namespace: '/'
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleDisconnect(client: Socket) {
    this.chatService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayLoad;
    try {
      payload = this.jwtService.verify(token);

      await this.chatService.registerClient(client, payload.id);

      // Enviar todos los mensajes al nuevo cliente
      const messages = await this.chatService.getAllMessages();
      client.emit(
        'all-messages',
        messages.map((msg) => ({
          name: msg.user.name,
          message: msg.content,
        })),
      );
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-updated', this.chatService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    const message = await this.chatService.saveMessage(client, payload);

    this.wss.emit('message-from-server', {
      name: message.user.name,
      message: message.content,
    });
  }
}
