import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PositionsModule } from '../positions/positions.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    PositionsModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret',
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}