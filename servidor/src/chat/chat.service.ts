import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { NewMessageDto } from './dto/new-message.dto';

interface ConnectedClients {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class ChatService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserName(socketId: string) {
    return this.connectedClients[socketId].user.name;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  async saveMessage(client: Socket, payload: NewMessageDto) {
    const user = this.connectedClients[client.id].user;
    const message = this.messageRepository.create({
      content: payload.message,
      user,
    });
    await this.messageRepository.save(message);
    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
