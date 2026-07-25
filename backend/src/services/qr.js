const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a QR code as base64 data URL
 */
const generateQRCode = async (data) => {
  const qrData = typeof data === 'string' ? data : JSON.stringify(data);
  const qrBase64 = await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: { dark: '#151617', light: '#EEE9DF' },
  });
  return qrBase64;
};

/**
 * Generate a unique QR token for a ticket
 */
const generateQRToken = (bookingCode, detailId) => {
  return `SC-${bookingCode}-${detailId}-${uuidv4().slice(0, 8).toUpperCase()}`;
};

module.exports = { generateQRCode, generateQRToken };
