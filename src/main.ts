import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as expressjwt from 'express-jwt';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT;
    app.enableCors();
    app.use(helmet());
    app.use(
        expressjwt({
            secret: process.env.SECRET,
            algorithms: ['HS256'],
        }).unless({
            path: [
                '/auth/users/login',
                '/auth/users/register',
                '/auth/login-token',
                '/auth/surfcamps/login',
                '/auth/surfcamps/register',
                '/',
            ],
        })
    );
    const server = await app.listen(port, () => {
        console.log(`Server started successfully in port ${port}`);
    });
    return { app, server };
}
// bootstrap();
