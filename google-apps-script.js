// ============================================================
// Google Apps Script — Picnic Social Order Handler
// ============================================================
// Deploy this as a Web App in Google Apps Script.
// It writes each order to a Google Sheet and emails 3 people.
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com and create a new project
// 2. Paste this entire file into Code.gs
// 3. Update EMAIL_RECIPIENTS below with your 3 email addresses
// 4. Update SHEET_ID with your Google Sheet ID
// 5. Click Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the deployment URL and paste it into your website's
//    config (src/config.js → APPS_SCRIPT_URL)
// ============================================================

const EMAIL_RECIPIENTS = [
  'kevin.thi.tran@gmail.com',
  'ps.picnic.social@gmail.com',
  'stephanie.sl.ly@gmail.com',
];

// The ID from your Google Sheet URL:
// https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SHEET_ID = '1JweCpemRMBW4xMex4M0aYA0zuYY4cjO1XX3_Pa9kND0';
const SHEET_NAME = 'Orders';

function doGet() {
  return HtmlService.createHtmlOutput('<p>Picnic Social order endpoint is running.</p>');
}

function doPost(e) {
  try {
    var data;
    if (e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    } else {
      data = JSON.parse(e.postData.contents);
    }

    writeToSheet(data);
    sendEmails(data);

    return HtmlService.createHtmlOutput('<p>OK</p>');
  } catch (err) {
    return HtmlService.createHtmlOutput('<p>Error: ' + err.toString() + '</p>');
  }
}

function writeToSheet(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Order Date',
      'Order Number',
      'Items',
      'Total',
      'Event Date',
      'Time Slot',
      'Delivery Method',
      'Customer Name',
      'Recipient Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'Special Notes',
    ]);
    sheet.getRange(1, 1, 1, 14).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
    data.orderNumber || '',
    data.items || data.box || '',
    data.total || data.price || '',
    data.date || '',
    data.timeslot || '',
    data.deliveryMethod || '',
    data.name || '',
    data.recipientName || '',
    data.email || '',
    data.phone || '',
    data.address || '',
    data.city || '',
    data.notes || '',
  ]);
}

function sendEmails(data) {
  const subject = `🧺 New Order — ${data.orderNumber}`;

  const body = `
New order received for Picnic Social!

ORDER DETAILS
─────────────────────────────
Order Number:    ${data.orderNumber}
Items:           ${data.items || data.box}
Total:           ${data.total || data.price}
Event Date:      ${data.date}
Time Slot:       ${data.timeslot}
Delivery:        ${data.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}

CUSTOMER INFO
─────────────────────────────
Name:            ${data.name}${data.recipientName ? `\nRecipient:       ${data.recipientName}` : ''}
Email:           ${data.email}
Phone:           ${data.phone}
${data.deliveryMethod === 'delivery' ? `Address:         ${data.address}, ${data.city}` : ''}

${data.notes ? `SPECIAL NOTES\n─────────────────────────────\n${data.notes}` : ''}
`.trim();

  const htmlBody = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #c4705a; padding: 20px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 22px;">🧺 New Order Received</h1>
  </div>
  <div style="background: #fdf8f5; padding: 24px; border: 1px solid #f0ddd5; border-top: none; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #3b2018;">
      <tr><td colspan="2" style="padding: 12px 0 6px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #e8c8b8;">Order Details</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060; width: 140px;">Order Number</td><td style="padding: 8px 0; font-weight: 600;">${data.orderNumber}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Items</td><td style="padding: 8px 0; font-weight: 600;">${data.items || data.box}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Total</td><td style="padding: 8px 0; font-weight: 600;">${data.total || data.price}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Event Date</td><td style="padding: 8px 0;">${data.date}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Time Slot</td><td style="padding: 8px 0;">${data.timeslot}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Delivery</td><td style="padding: 8px 0;">${data.deliveryMethod === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</td></tr>

      <tr><td colspan="2" style="padding: 16px 0 6px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #e8c8b8;">Customer Info</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
      ${data.recipientName ? `<tr><td style="padding: 8px 0; color: #8a7060;">Recipient</td><td style="padding: 8px 0; font-weight: 600;">${data.recipientName}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #8a7060;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #c4705a;">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Phone</td><td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #c4705a;">${data.phone}</a></td></tr>
      ${data.deliveryMethod === 'delivery' ? `<tr><td style="padding: 8px 0; color: #8a7060;">Address</td><td style="padding: 8px 0;">${data.address}, ${data.city}</td></tr>` : ''}
    </table>
    ${data.notes ? `
    <div style="margin-top: 16px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #e8c8b8;">
      <strong style="color: #8a7060; font-size: 13px;">Special Notes:</strong>
      <p style="margin: 6px 0 0; color: #3b2018;">${data.notes}</p>
    </div>` : ''}
  </div>
</div>`.trim();

  EMAIL_RECIPIENTS.forEach(function(email) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      htmlBody: htmlBody,
    });
  });
}

// Test function — run manually in script editor to verify setup
function testSetup() {
  const testData = {
    orderNumber: 'PS-TEST-001',
    items: 'Classic Box x2, Fruit Platter x1',
    total: '$205',
    date: 'March 30, 2026',
    timeslot: '11:00 AM – 1:00 PM',
    deliveryMethod: 'delivery',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Windsor',
    notes: 'This is a test order',
  };

  writeToSheet(testData);
  Logger.log('Sheet write successful! Check your Google Sheet.');

  // Uncomment the line below to also test emails:
  // sendEmails(testData);
}
