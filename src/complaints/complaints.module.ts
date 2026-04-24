import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { DatabaseService} from '../database/database.service';


@Module({
  controllers: [ComplaintsController],
  providers: [ComplaintsService, DatabaseService],
})
export class ComplaintsModule {}