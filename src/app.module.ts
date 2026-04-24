import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ResidentsModule} from './residents/residents.module'
import { ComplaintsModule } from './complaints/complaints.module';

@Module({
  imports: [ AuthModule, DatabaseModule, ResidentsModule, ComplaintsModule],
})
export class AppModule {} 