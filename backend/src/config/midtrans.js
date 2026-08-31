// Konfigurasi Midtrans Snap untuk payment gateway
const midtransClient = require('midtrans-client');

const snapClient = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snapClient;
