import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret',
    });
  }

  async validate(payload: any) {
    console.log('Decoding Payload', payload);

    if (!payload || !payload.role) return null; 


    if(payload.role === 'admin') {
      return {
        adminId: payload.sub,
        admin_name: payload.admin_name,
        role: payload.role
      };
    }

    if (payload.role === 'resident') {
      return {
      residentId: payload.sub,
      resident_name: payload.resident_name,
      zone: payload.zone,
      role: payload.role
    };
  }

  return null;
  }
}