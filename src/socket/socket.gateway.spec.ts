import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';

describe('SocketGateway', () => {
    let gateway: SocketGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SocketGateway],
        }).compile();

        gateway = module.get<SocketGateway>(SocketGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    describe('When afterInit', () => {
        test('logger should be called', () => {
            jest.spyOn(gateway.logger, 'log');

            gateway.afterInit({} as unknown as Server);
            expect(gateway.logger.log).toHaveBeenCalledWith('Init');
        });
    });

    describe('When handleConnection', () => {
        test('logger should be called', () => {
            jest.spyOn(gateway.logger, 'log');

            gateway.handleConnection({ id: '123' } as unknown as Socket);
            expect(gateway.logger.log).toHaveBeenCalledWith(
                'Client connected: 123'
            );
        });
    });

    describe('When handleDisconnection', () => {
        test('logger should be called', () => {
            jest.spyOn(gateway.logger, 'log');

            gateway.handleDisconnect({ id: '123' } as unknown as Socket);
            expect(gateway.logger.log).toHaveBeenCalledWith(
                'Client disconnected: 123'
            );
        });
    });

    describe('When controller.loginUser is called', () => {
        it('It should call service.loginUser', () => {
            gateway.server = {
                emit: jest.fn() as any,
            } as Server;
            const mockClient = {};
            const mockPayload = {
                surfcampId: '123',
                packageId: '1234',
                userId: '12345',
            };
            gateway.handleBooking(mockClient as unknown as Socket, mockPayload);
        });
    });
});
