import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResidentsService } from '../residents/residents.service';
import { AdminService } from '../admin/admin.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private residentsService: ResidentsService, private adminService: AdminService) {}

  @Post('resident/register')
  async ResidentRegister(@Body() body: { resident_name: string; zone: string; resident_password: string;}) {
    return await this.residentsService.createResidents(body.resident_name, body.zone, body.resident_password);
  }

  @Post('resident/login')
  async ResidentLogin(@Body() body: { resident_name: string; resident_password: string;}) {
    const resident = await this.authService.validateResident(body.resident_name, body.resident_password);
    if (!resident) {
      return { error: 'Invalid credentials' };
    }
    return await this.authService.ResidentLogin(resident);
  }

  @Post('resident/logout')
  async residentlogout(@Body() body: { residentId: number }) {
    return await this.authService.ResidentLogout(body.residentId);
  }

  @Post('resident/refresh')
  async ResidentRefresh(@Body() body: { refreshToken: string }) {
    return await 
    this.authService.refreshTokensOfResident(body.refreshToken);
  }

  @Post('admin/register')
  async register(@Body() body: { admin_name: string; admin_password: string }) {
    return await this.adminService.createAdmin(body.admin_name, body.admin_password);
  }

  @Post('admin/login')
  async login(@Body() body: { admin_name: string; admin_password: string}) {
    const admin= await this.authService.validateAdmin(body.admin_name, body.admin_password);
    if (!admin) {
      return { error: 'Invalid credentials' };
    }
    return await this.authService.AdminLogin(admin);
  }

  @Post('admin/logout')
  async adminlogout(@Body() body: { adminId: number }) {
    return await this.authService.AdminLogout(body.adminId);
  }

  @Post('admin/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return await
    this.authService.refreshTokens(body.refreshToken);
  }

}