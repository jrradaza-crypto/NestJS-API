import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
    findAll(@Req() req: any) {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedException('Only admins can view all complaints')
      }
      return this.complaintsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
    getAll(@Req() req: any) {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedException('Only admins can view all complaints')
      }
      return this.complaintsService.findAllByResident(req.user.adminId);
  }      


  @UseGuards(JwtAuthGuard)
  @Get(':residentId')
    findOne(@Param('residentId') residentId: number) {
      return this.complaintsService.findOne(residentId);
  }  

  @UseGuards(JwtAuthGuard)
  @Post()
    create(@Body() body: any, @Req() req: any) {
      console.log('-------TOKEN DATA-------', req.user);

      const { residentId, resident_name, zone } = req.user;
      return this.complaintsService.create(residentId, resident_name, zone, body.complaintCategory, body.description, body.location);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':resident/:complaintId')
    updateResident(@Param('complaintId') complaintId: number, @Body() body: any, @Req() req:any) {
    return this.complaintsService.updateComplaintByResident(complaintId, req.user.residentId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':resident/:complaintId')
    remove(@Param('complaintId') complaintId: number, @Req() req:any) {
      return this.complaintsService.removeComplaintByResident(complaintId, req.user.residentId);
  }

  @UseGuards(JwtAuthGuard)                                   
    @Put(':admin/update/:complaintId')
      updateComplaint(@Param('complaintId') complaintId: number, @Body() body: any, @Req() req:any) {
      return this.complaintsService.updateComplaintByAdmin(complaintId, req.user.adminId, body);
    }
  
  @UseGuards(JwtAuthGuard)
    @Delete(':admin/:complaintId')
      removeComplaint(@Param('complaintId') complaintId: number, @Req() req:any) {
        return this.complaintsService.removeComplaintByAdmin(complaintId, req.user.adminId);
    }

}