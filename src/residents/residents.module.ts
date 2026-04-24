import { Module } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ResidentsController],
  providers: [ResidentsService],
  exports: [ResidentsService], 
})
export class ResidentsModule {}