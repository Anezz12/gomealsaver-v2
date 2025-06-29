// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client');

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// ✅ Log untuk debugging
console.log('🔧 Midtrans Config:', {
  merchantId: 'G744812019', // Merchant ID Anda
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  hasServerKey: !!process.env.MIDTRANS_SERVER_KEY,
  hasClientKey: !!process.env.MIDTRANS_CLIENT_KEY,
});
