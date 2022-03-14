import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT;
    app.enableCors();
    app.use(helmet());
    await app.listen(port, () => {
        console.log(`Server started successfully in port ${port}`);
    });
}
bootstrap();
