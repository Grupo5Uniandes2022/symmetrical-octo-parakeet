import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from './entities/pay.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pay]),
    AuthModule
  ],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService]
})
export class PayModule {}
