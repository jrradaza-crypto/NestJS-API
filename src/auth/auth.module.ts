import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ResidentsModule } from '../residents/residents.module';
import { ComplaintsModule } from '../complaints/complaints.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminModule } from '../admin/admin.module';


@Module({
  imports: [
    AdminModule,
    ResidentsModule,
    PassportModule,
    ComplaintsModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret',
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1800s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}