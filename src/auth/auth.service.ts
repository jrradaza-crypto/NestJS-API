// I add address to validate user's address.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, enteredPassword: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user){
      console.error('User not found:', username);  
     return null;
    }
    const isMatch = await bcrypt.compare(enteredPassword, user.password);
    if (!isMatch) {
      console.error('Password is not match for', username)
    }
    const {password, ...result} = user;
    return result;
  }

  async login(user: { userId: number; username: string; address:string, role: string }) {
    const payload = { sub: user.userId, username: user.username, address: user.address, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' },
    );

    await this.usersService.setRefreshToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.usersService.setRefreshToken(userId, null);
    return { ok: true };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
      const found = await this.usersService.findByRefreshToken(refreshToken);
      if(!found) throw new UnauthorizedException('Invalid refresh token not found');

      const payload = { sub: found.id, username: found.username, address: found.address, role: found.role};
      const accessToken = this.jwtService.sign(payload);
      const newRefresh = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
      });

      await this.usersService.setRefreshToken(found.id, newRefresh);
      return { accessToken, newRefresh};
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }
}