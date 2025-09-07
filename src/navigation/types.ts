import { UpiPaymentParams } from '../payment/upiTypes';

export type RootStackParamList = {
  Home: undefined;
  PaymentInput: undefined;
  QRCode: {
    paymentData: UpiPaymentParams;
  };
};
