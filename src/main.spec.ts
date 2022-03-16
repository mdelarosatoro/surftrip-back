import { bootstrap } from './main';
import * as request from 'supertest';

describe('main', () => {
    it('should bootstrap', async () => {
        process.env.JWT_SECRET = 'test';
        const { app, server } = await bootstrap();
        const response = await request(server).get('/');
        // await request(server).get('/21321312312313');
        // await request(server).get('/users/123');
        await request(server).post('/auth/users/register').send({
            email: 'test1@test.com',
            username: 'test1',
            password: 'test',
            name: 'test',
            lastName: 'test',
        });
        await request(server).post('/auth/users/register').send({
            email: 'test1@test.com',
            username: 'test1',
            password: 'test',
            name: 'test',
            lastName: 'test',
        });
        await request(server)
            .post('/auth/users/login')
            .send({ username: 'test12', password: 'test' });
        await request(server)
            .delete('/users/622f9820516f56b9ff437d3ea')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzBkZWU5YjRiYjRiNzE2YTNkMTE2YSIsIm5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NDc0MzA0MzN9.uOPmU1gl7u9y3-lGxOSJzZlYUP3uasGljk-Dzif6qZg'
            );
        app.close();
        expect(response.status).toBe(200);
    });
});
