import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
    findAll(@Req() req: any) {
      console.log('User:', req.user)
      return this.positionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
    findOne(@Param('userId') userId: number) {
      return this.positionsService.findOne(userId);
  }  

  @UseGuards(JwtAuthGuard)
  @Post()
    create(@Body() body: any, @Req() req: any) {
      const userId = req.user.userId;
      return this.positionsService.create(body.position_code, body.position_name, body.agency, body.salary, body.location, body.status, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
    update(@Param('userId') userId: number, @Body() body: any, @Req() req:any) {
    return this.positionsService.update(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
    remove(@Param('userId') userId: number) {
      return this.positionsService.remove(userId);
  }
}