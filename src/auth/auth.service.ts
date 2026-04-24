import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResidentsService } from '../residents/residents.service';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private residentsService: ResidentsService, private adminService: AdminService, private jwtService: JwtService) {}

  async validateResident(resident_name: string, resident_password: string): Promise<any> {
    const resident = await this.residentsService.findByResidentName(resident_name);
    if (!resident){
      console.error('Resident not found:', resident_name);  
     return null;
    }
    const isMatch = await bcrypt.compare(resident_password, resident.resident_password);
    if (!isMatch) {
      console.error('Password is not match for', resident_name)
      return null;
    }
    const {password, ...result} = resident;
    return result;
  }

  async ResidentLogin(resident: { residentId: number; resident_name: string; zone: string; role: string}){
    const payload = { sub: resident.residentId, resident_name: resident.resident_name, zone: resident.zone, role: 'resident'};
    const accessToken = this.jwtService.sign(payload);        

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '3600s' },
    );

    await this.residentsService.setRefreshToken(resident.residentId, refreshToken);

    return { accessToken, refreshToken };
  }

  async ResidentLogout(residentId: number) {
    await this.residentsService.setRefreshToken(residentId, null);
    return { ok: true };
  }

  async refreshTokensOfResident(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
      const found = await this.residentsService.findByRefreshToken(refreshToken);
      if(!found) throw new UnauthorizedException('Invalid refresh token not found');

      const payload = { sub: found.id, resident_name: found.resident_name, zone: found.zone};
      const accessToken = this.jwtService.sign(payload);
      const newRefresh = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '3600s',
      });

      await this.residentsService.setRefreshToken(found.id, newRefresh);
      return { accessToken, newRefresh};
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }

  async validateAdmin(admin_name: string, admin_password: string): Promise<any> {
    const admin = await this.adminService.findByAdminName(admin_name);
    if (!admin){
      console.error('Admin not found:', admin_name);  
     return null;
    }
    const isMatch = await bcrypt.compare(admin_password, admin.admin_password);
    if (!isMatch) {
      console.error('Password is not match for', admin_name)
      return null;
    }
    const {password, ...result} = admin;
    return result;
  }

  async AdminLogin(admin: { adminId: number; admin_name: string; role: string}){
    const payload = { sub: admin.adminId, admin_name: admin.admin_name, role: 'admin' };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '3600s' },
    );

    await this.adminService.setRefreshToken(admin.adminId, refreshToken);

    return { accessToken, refreshToken };
  }

  async AdminLogout(adminId: number) {
    await this.adminService.setRefreshToken(adminId, null);
    return { ok: true };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret');
      const found = await this.adminService.findByRefreshToken(refreshToken);
      if(!found) throw new UnauthorizedException('Invalid refresh token not found');

      const payload = { sub: found.id, admin_name: found.admin_name};
      const accessToken = this.jwtService.sign(payload);
      const newRefresh = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret', {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '3600s',
      });

      await this.adminService.setRefreshToken(found.id, newRefresh);
      return { accessToken, newRefresh};
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }
}