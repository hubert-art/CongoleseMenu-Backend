import { Test, TestingModule } from '@nestjs/testing';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';
import { ReceiptService } from '../receipt/receipt.service';

describe('MpesaController', () => {
  let controller: MpesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MpesaController],
      providers: [
        {
          provide: MpesaService,
          useValue: {
            stkPush: jest.fn().mockResolvedValue({
              MerchantRequestID: '123',
              ResponseCode: '0',
            }),
          },
        },
        {
          provide: ReceiptService,
          useValue: {
            generateReceipt: jest.fn().mockReturnValue({ total: 100 }),
          },
        },
      ],
    }).compile();

    controller = module.get<MpesaController>(MpesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
