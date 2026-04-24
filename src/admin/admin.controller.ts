import { Controller, Get, Query, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
constructor(private adminService: AdminService) {}

  @UseGuards (JwtAuthGuard)
  @Get()
  async getAll(){
    return await this.adminService.getAllAdmins();
  }

  @UseGuards (JwtAuthGuard)
  @Get(':adminId')
  async getOne(@Param('adminId') adminId: string) {
    return await this.adminService.findByAdminId(+adminId);
  }

  @Post()
  async create(@Body() body: { admin_name: string; admin_password: string}) {
    return this.adminService.createAdmin(body.admin_name, body.admin_password);
  }

  @UseGuards (JwtAuthGuard)
  @Put(':adminId')
  async update(@Param('adminId') adminId: string, @Body() partial: any) {
    return this.adminService.updateAdmins(+adminId, partial);
  }

  @UseGuards (JwtAuthGuard)
  @Delete(':adminId')
  async remove(@Param('adminId') adminId: string) {
    return this.adminService.deleteAdmin(+adminId);
  }
}