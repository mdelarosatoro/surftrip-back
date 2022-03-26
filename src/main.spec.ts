import { bootstrap } from './main';
import * as request from 'supertest';

describe('main', () => {
    it('should bootstrap', async () => {
        process.env.JWT_SECRET = 'test';
        const { app, server } = await bootstrap();
        const response = await request(server).get('/');
        const responseRegister = await request(server)
            .post('/auth/users/register')
            .send({
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
            .send({ username: 'fail', password: 'fail' });
        await request(server)
            .post('/auth/users/login')
            .send({ fail: 'test1', fails: 'test' });
        const loginResponse = await request(server)
            .post('/auth/users/login')
            .send({ username: 'test1', password: 'test' });
        await request(server)
            .delete(`/users/${responseRegister.body._id}`)
            .set('Authorization', `Bearer ${loginResponse.body.token}`);
        app.close();
        expect(response.status).toBe(200);
    });
});
