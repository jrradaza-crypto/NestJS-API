// I add posting an address and declare it as a string.

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
constructor(private usersService: UsersService) {}

  @UseGuards (JwtAuthGuard)
  @Get()
  async getAll(){
    return await this.usersService.getAll();
  }

  @UseGuards (JwtAuthGuard)
  @Get(':userId')
  async getOne(@Param('userId') userId: string) {
    return await this.usersService.findById(+userId);
  }

  @Post()
  async create(@Body() body: { username: string; address: string, password: string}) {
    return this.usersService.createUser(body.username, body.address, body.password);
  }

  @UseGuards (JwtAuthGuard)
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() partial: any) {
    return this.usersService.updateUser(+userId, partial);
  }


  @UseGuards (JwtAuthGuard)
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return this.usersService.deleteUser(+userId);
  }
}