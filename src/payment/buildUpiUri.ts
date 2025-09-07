import { BuiltUpiUriResult, UpiPaymentParams } from './upiTypes';

// UPI URI spec (simplified): upi://pay?pa=...&pn=...&mc=...&tr=...&tn=...&am=...&cu=INR&url=...
// Required minimal: pa (payee address), either tr or tid is recommended for uniqueness.

function encodeKV(key: string, value: string | number | undefined) {
  if (value === undefined || value === null || value === '') return undefined;
  return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
}

export function buildUpiUri(params: UpiPaymentParams): BuiltUpiUriResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!params.payeeVpa) missing.push('payeeVpa(pa)');

  if (params.amount !== undefined) {
    if (Number.isNaN(params.amount) || params.amount <= 0) {
      warnings.push('amount must be > 0');
    }
  }

  const entries: (string | undefined)[] = [
    encodeKV('pa', params.payeeVpa),
    encodeKV('pn', params.payeeName),
    encodeKV('mc', params.merchantCode),
    encodeKV('tr', params.transactionRef),
    encodeKV('tn', params.transactionNote),
    encodeKV('am', params.amount?.toFixed(2)),
    encodeKV('cu', params.currency || 'INR'),
    encodeKV('mam', params.minimumAmount),
    encodeKV('tid', params.transactionId),
    encodeKV('url', params.url),
  ].filter(Boolean);

  const query = entries.join('&');
  const uri = `upi://pay?${query}`;
  return { uri, missing, warnings };
}
