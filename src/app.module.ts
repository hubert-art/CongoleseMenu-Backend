import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MpesaService } from './mpesa/mpesa.service';
import { MpesaController } from './mpesa/mpesa.controller';
import { MpesaModule } from './mpesa/mpesa.module';
import { ReceiptService } from './receipt/receipt.service';
import { ReceiptModule } from './receipt/receipt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // rend les variables .env accessibles partout
    }),
    MpesaModule,
    ReceiptModule,
  ],
  controllers: [AppController, MpesaController],
  providers: [AppService, MpesaService, ReceiptService],
})
export class AppModule {}
