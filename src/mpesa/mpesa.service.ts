import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

@Injectable()
export class MpesaService {
  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(): Promise<string> {
    const consumerKey = this.configService.get<string>('MPESA_CONSUMER_KEY');
    const consumerSecret = this.configService.get<string>(
      'MPESA_CONSUMER_SECRET',
    );

    if (!consumerKey || !consumerSecret) {
      throw new Error(
        'MPESA_CONSUMER_KEY ou MPESA_CONSUMER_SECRET manquant dans .env',
      );
    }

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return response.data.access_token;
  }

  async stkPush(phone: string, amount: number): Promise<StkPushResponse> {
    try {
      const shortcode = this.configService.get<string>('MPESA_SHORTCODE');
      const passkey = this.configService.get<string>('MPESA_PASSKEY');
      const callbackUrl = this.configService.get<string>('MPESA_CALLBACK_URL');

      if (!shortcode || !passkey || !callbackUrl) {
        throw new Error('Configuration MPESA incomplète dans .env');
      }

      const token = await this.getAccessToken();

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14);

      const password = Buffer.from(shortcode + passkey + timestamp).toString(
        'base64',
      );

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.ceil(amount),
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: callbackUrl,
          AccountReference: 'MenuCulturel',
          TransactionDesc: 'Paiement repas',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error: any) {
      console.log('💥 FULL MPESA ERROR:');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(error.response?.data);
      throw new Error('Erreur lors du STK Push');
    }
    // catch (error: unknown) {
    //   if (error instanceof Error) {
    //     console.error('💥 STK Push Error:', error.message);
    //   } else {
    //     console.error('💥 STK Push Error:', error);
    //   }

    //   throw new Error('Erreur lors du STK Push');
    // }
  }
}
