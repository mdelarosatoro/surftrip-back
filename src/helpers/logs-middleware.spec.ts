import LogsMiddleware from './logs-middleware';

describe('LoggerMiddleware', () => {
    it('should be defined', () => {
        expect(new LogsMiddleware()).toBeDefined();
    });
});
