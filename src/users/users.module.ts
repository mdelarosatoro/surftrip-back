import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UserOwnershipMiddleware } from 'src/middleware/user-ownership';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserOwnershipMiddleware)
            .exclude({ path: 'users/:id', method: RequestMethod.GET })
            .forRoutes(UsersController);
    }
}
