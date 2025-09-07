export interface UpiPaymentParams {
  payeeVpa: string;          // e.g. merchant@icici
  payeeName?: string;        // Merchant or individual name
  merchantCode?: string;     // Optional merchant category code
  transactionRef?: string;   // Unique order / transaction id
  transactionNote?: string;  // Short note shown to payer
  amount?: number;           // Decimal amount, up to 2 places
  currency?: string;         // Default INR
  minimumAmount?: number;    // For collect requests
  transactionId?: string;    // Alternate to transactionRef (txnId)
  url?: string;              // Callback / deeplink url
}

export interface BuiltUpiUriResult {
  uri: string;
  missing: string[]; // required fields missing
  warnings: string[]; // formatting warnings
}
