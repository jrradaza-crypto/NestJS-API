import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('residents')
export class ResidentsController {
constructor(private residentsService: ResidentsService) {}

  @UseGuards (JwtAuthGuard)
  @Get()
  async getAll(){
    return await this.residentsService.getAll();
  }

  @UseGuards (JwtAuthGuard)
  @Get(':residentId')
  async getOne(@Param('residentId') residentId: string) {
    return await this.residentsService.findByResidentId(+residentId);
  }

  @Post()
  async create(@Body() body: { resident_name: string; zone:string; resident_password: string, role: 'resident'}) {
    return this.residentsService.createResidents(body.resident_name, body.zone, body.resident_password, body.role);
  }

  @UseGuards (JwtAuthGuard)
  @Put(':residentId')
  async update(@Param('residentId') residentId: string, @Body() partial: any) {
    return this.residentsService.updateResidents(+residentId, partial);
  }


  @UseGuards (JwtAuthGuard)
  @Delete(':residentId')
  async remove(@Param('residentId') residentId: string) {
    return this.residentsService.deleteResident(+residentId);
  }
}  