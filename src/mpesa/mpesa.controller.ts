// import { Controller, Post, Body } from '@nestjs/common';
// import { ReceiptService } from '../receipt/receipt.service';
// import { MpesaService } from './mpesa.service';
// import { StkPushResponse } from './mpesa.service';

// @Controller('mpesa')
// export class MpesaController {
//   constructor(
//     private readonly receiptService: ReceiptService,
//     private readonly mpesaService: MpesaService,
//   ) {}

//   @Post('stk')
//   async stkPush(
//     @Body() body: { phone: string; amount: number },
//   ): Promise<StkPushResponse> {
//     return this.mpesaService.stkPush(body.phone, body.amount);
//   }

//   @Post('callback')
//   handleCallback(@Body() body: any) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     const resultCode = body.Body.stkCallback.ResultCode;

//     if (resultCode === 0) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//       const phone = body.Body.stkCallback.CallbackMetadata.Item.find(
//         (i: { Name: string }) => i.Name === 'PhoneNumber',
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       ).Value;

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//       const amount = body.Body.stkCallback.CallbackMetadata.Item.find(
//         (i: { Name: string }) => i.Name === 'Amount',
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       ).Value;

//       // 1️⃣ Générer le PDF reçu
//       const pdfPath = this.receiptService.generatePDF({
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         phone,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         amount,
//         plats: [], // ici on peut envoyer le panier complet
//       });
//       return { message: 'Paiement validé', pdfPath };
//     }

//     return { message: 'Paiement échoué' };
//   }
// }

import { Controller, Post, Body } from '@nestjs/common';
import { ReceiptService } from '../receipt/receipt.service';
import { MpesaService } from './mpesa.service';

interface Item {
  nom: string;
  prix: number;
  quantity: number;
  image?: string;
}

interface StkCallbackBody {
  Body: {
    stkCallback: {
      ResultCode: number;
      CallbackMetadata: {
        Item: { Name: string; Value: any }[];
      };
    };
    items?: Item[]; // items envoyés par le frontend
  };
}

@Controller('mpesa')
export class MpesaController {
  constructor(
    private readonly receiptService: ReceiptService,
    private readonly mpesaService: MpesaService,
  ) {}

  @Post('stk')
  async stkPush(@Body() body: { phone: string; amount: number }) {
    return this.mpesaService.stkPush(body.phone, body.amount);
  }

  @Post('callback')
  handleCallback(@Body() body: StkCallbackBody) {
    const resultCode = body.Body.stkCallback.ResultCode;

    if (resultCode === 0) {
      // Récupère le numéro de téléphone
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const phone = body.Body.stkCallback.CallbackMetadata.Item.find(
        (i) => i.Name === 'PhoneNumber',
      )?.Value;

      // Récupère les items envoyés par le frontend (ou vide si pas fourni)
      const plats = body.Body.items || [];

      // Génère le PDF
      const pdfPath = this.receiptService.generatePDF({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        phone,
        plats,
      });

      return { message: 'Paiement validé', pdfPath };
    }

    return { message: 'Paiement échoué' };
  }
}
