import { Logger } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: true })
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    public logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('newBooking')
    handleBooking(client: Socket, payload: any): void {
        this.logger.log(
            `User with Id ${payload.userId} has booked package ${payload.packageId} of Surfcamp ${payload.surfcampId}`
        );
        this.server.emit('newBookingNotification', payload);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
