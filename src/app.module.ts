import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SurfcampsModule } from './surfcamps/surfcamps.module';
import { PackagesModule } from './packages/packages.module';
import LogsMiddleware from './helpers/logs-middleware';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@test-cluster.iqlbh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority

`),
        AuthModule,
        UsersModule,
        SurfcampsModule,
        PackagesModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
    }
}
