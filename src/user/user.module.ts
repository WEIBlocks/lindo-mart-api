import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user/user.schema';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    forwardRef(() => AlertsModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
