import { Module } from '@nestjs/common';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';
import { ReceiptModule } from '../receipt/receipt.module';

@Module({
  imports: [ReceiptModule],
  controllers: [MpesaController],
  providers: [MpesaService],
})
export class MpesaModule {}
