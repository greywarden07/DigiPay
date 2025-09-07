# DigiPay (UPI QR Payment App)

A React Native mobile app for generating UPI payment QR codes. Use this app to create QR codes that anyone can scan to send you money via UPI.

## Features
- Create UPI payment QR codes for receiving money
- Input validation for UPI IDs and payment details
- Share payment links directly from the app
- Multiple screens with navigation
- Clean, user-friendly interface

## Inputs Required for QR Generation
The app allows you to specify these payment details:

### Required fields:
- **UPI ID / VPA** (pa): Your payment address (e.g., name@bank)
- **Payee Name** (pn): Your name or business name

### Optional fields:
- **Amount** (am): Fixed amount or leave blank for payer to enter
- **Transaction Reference** (tr): Auto-generated but can be customized
- **Payment Note** (tn): Short description of what the payment is for

## Getting Started
Install dependencies (Node 18+ recommended):

```powershell
npm install
npx expo start
```

Scan the Expo QR with Expo Go app (Android) or use an emulator.

## How it Works
1. Enter your UPI details on the input screen
2. Generate a QR code
3. Let others scan it with any UPI app (Google Pay, PhonePe, etc.)
4. Receive payments directly to your linked bank account

## Supported UPI Apps
The generated QR codes work with all UPI-enabled payment apps including:
- Google Pay
- PhonePe
- Paytm
- Amazon Pay
- BHIM
- Banking apps with UPI support

## License
MIT (adjust as needed)
