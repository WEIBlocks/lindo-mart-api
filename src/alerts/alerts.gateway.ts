import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: true,
    // credentials: true,
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AlertsGateway.name);
  private connectedClients = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Get token from handshake auth
      const token = client.handshake.auth.token?.replace('Bearer ', '');
      if (!token) {
        this.logger.error('No token provided');
        client.disconnect();
        return;
      }

      // Verify token
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload) {
        this.logger.error('Invalid token');
        client.disconnect();
        return;
      }

      // Store user connection
      this.connectedClients.set(payload.sub, client.id);
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);

      // Automatically join user to their room
      client.join(payload.sub);
      this.logger.log(`User ${payload.sub} joined their room`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove disconnected client from our map
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
    this.logger.log(`Client ${client.id} joined room: ${userId}`);
  }

  // Method to send notification to a specific user
  async sendNotificationToUser(userId: string, message: string) {
    this.server.to(userId).emit('alert', message);
    this.logger.log(`Notification sent to user ${userId}: ${message}`);
  }

  // Method to send notification to users by role
  async sendNotificationByRole(role: string, message: string) {
    this.server.to(role).emit('alert', message);
    this.logger.log(`Notification sent to role ${role}: ${message}`);
  }
}
