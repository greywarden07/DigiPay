# UPI QR Code Inputs (Send Money / Merchant Payment)

A standard UPI payment QR encodes a URI that starts with:

```
upi://pay?pa=...&pn=...&tr=...&tn=...&am=...&cu=INR
```

## Core Parameters

Required minimum for a functional pay intent:
- pa (payeeVpa): Virtual Payment Address (e.g. merchant@icici)
- pn (payeeName): Display name (recommended for user trust)
- tr (transactionRef): Unique reference for this order (recommended)
- am (amount): Amount (optional if allowing user-entered amount)
- cu (currency): Typically INR (default if omitted in many apps but good to include)
- tn (transactionNote): Short note (optional, helps user identify purpose)

## Extended / Optional Parameters
- tid (transactionId): Alternate unique transaction / order id (some PSPs use tid internally)
- mc (merchantCode): Merchant Category Code (for registered merchants)
- mam (minimumAmount): For collect requests
- url: Callback or deep link back to merchant (for post-payment redirection)

## Example URI
```
upi://pay?pa=merchant@icici&pn=Demo%20Merchant&tr=ORDER12345&tn=Order%20%2312345&am=49.99&cu=INR
```

## Validation Notes
- Amount should be positive and max 2 decimals.
- Use a unique `tr` (or `tid`) per order to ease reconciliation.
- Keep `tn` short (many apps truncate beyond ~40 chars).

## Security / Integrity
- Do not embed sensitive info (no secrets).
- Consider signing higher-value requests via backend + dynamic QR strategies if required.

## Flow (Scan & Pay)
1. User scans QR.
2. UPI app parses URI, shows pay sheet.
3. User confirms & authenticates (PIN).
4. Collect payment confirmation via webhook / polling with reference id.

## Next Steps
- Hook a backend to verify payment status using PSP / bank callbacks.
- Add dynamic QR generation per order to avoid duplicate references.
- Display status updates in the mobile app after payment.
