import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [AuthService, DatabaseService],
  controllers: [AuthController],
})
export class AuthModule {}
