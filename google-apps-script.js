// ============================================================
// Google Apps Script — Picnic Social Order Handler (with Approval)
// ============================================================
// Workflow:
// 1. Customer submits order → Pending email sent, status = "Pending"
// 2. Owners receive notification with Approve / Decline buttons
// 3. Owner clicks Approve → customer gets full confirmation
// 4. Owner clicks Decline → customer gets polite decline email
//
// SETUP:
// 1. Replace SECRET below with a random string (any text, keep it private)
// 2. Update EMAIL_RECIPIENTS and SHEET_ID if needed
// 3. Deploy → Manage deployments → Edit → New version → Deploy
// ============================================================

const SECRET = 'picnic-social-secret-2026-change-me-to-something-random';

// IMPORTANT: Paste your deployed Web App URL here (ends in /exec)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbybhbANFkXPXNcgxuT2vJCIauEvCfvPQTpSZEsRjK5PEnPD6zAr-5J5eEOeeST_RSpL/exec';

const EMAIL_RECIPIENTS = [
  'kevin.thi.tran@gmail.com',
  'ps.picnic.social@gmail.com',
  'stephanie.sl.ly@gmail.com',
];

const SHEET_ID = '1JweCpemRMBW4xMex4M0aYA0zuYY4cjO1XX3_Pa9kND0';
const SHEET_NAME = 'Orders';

const HEADERS = [
  'Order Date',
  'Order Number',
  'Status',
  'Items',
  'Add-Ons',
  'Delivery Fee',
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
];

// ============================================================
// Web entry points
// ============================================================

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  const orderNumber = e && e.parameter && e.parameter.order;
  const token = e && e.parameter && e.parameter.token;

  if (!action) {
    return HtmlService.createHtmlOutput('<p>Picnic Social order endpoint is running.</p>');
  }

  if (!orderNumber || !token) {
    return resultPage('Invalid request', 'Missing required parameters.', '#c4705a');
  }

  if (token !== generateToken(orderNumber)) {
    return resultPage('Invalid token', 'This approval link is no longer valid.', '#b54040');
  }

  const order = findOrderRow(orderNumber);
  if (!order) {
    return resultPage('Order not found', 'We could not find an order with number ' + orderNumber + '.', '#b54040');
  }

  if (order.data.status === 'Approved' || order.data.status === 'Declined') {
    return resultPage(
      'Already ' + order.data.status.toLowerCase(),
      'This order was already marked as ' + order.data.status + '. No further action needed.',
      '#8a7060'
    );
  }

  if (action === 'approve') {
    updateOrderStatus(order.row, 'Approved');
    sendApprovedEmail(order.data);
    return resultPage(
      'Order Approved',
      'Order ' + orderNumber + ' has been approved. The customer has been notified.',
      '#2f9e6d'
    );
  }

  if (action === 'decline') {
    updateOrderStatus(order.row, 'Declined');
    sendDeclinedEmail(order.data);
    return resultPage(
      'Order Declined',
      'Order ' + orderNumber + ' has been declined. The customer has been notified.',
      '#b54040'
    );
  }

  return resultPage('Unknown action', 'Action must be "approve" or "decline".', '#c4705a');
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
    sendOwnerNotification(data);
    sendPendingEmail(data);

    return HtmlService.createHtmlOutput('<p>OK</p>');
  } catch (err) {
    return HtmlService.createHtmlOutput('<p>Error: ' + err.toString() + '</p>');
  }
}

// ============================================================
// Sheet helpers
// ============================================================

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function writeToSheet(data) {
  const sheet = getOrCreateSheet();
  sheet.appendRow([
    new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }),
    data.orderNumber || '',
    'Pending',
    data.items || data.box || '',
    data.addOns || 'None',
    data.deliveryFee || 'N/A',
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

function findOrderRow(orderNumber) {
  const sheet = getOrCreateSheet();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === orderNumber) {
      const row = values[i];
      return {
        row: i + 1,
        data: {
          orderDate: row[0],
          orderNumber: row[1],
          status: row[2],
          items: row[3],
          addOns: row[4],
          deliveryFee: row[5],
          total: row[6],
          date: row[7],
          timeslot: row[8],
          deliveryMethod: row[9],
          name: row[10],
          recipientName: row[11],
          email: row[12],
          phone: row[13],
          address: row[14],
          city: row[15],
          notes: row[16],
        },
      };
    }
  }
  return null;
}

function updateOrderStatus(rowNumber, status) {
  const sheet = getOrCreateSheet();
  sheet.getRange(rowNumber, 3).setValue(status);
}

// ============================================================
// Token / URL helpers
// ============================================================

function generateToken(orderNumber) {
  const raw = Utilities.computeHmacSha256Signature(orderNumber, SECRET);
  return Utilities.base64EncodeWebSafe(raw).slice(0, 16);
}

function getActionUrl(action, orderNumber) {
  const token = generateToken(orderNumber);
  return WEB_APP_URL + '?action=' + action + '&order=' + encodeURIComponent(orderNumber) + '&token=' + token;
}

// ============================================================
// Result HTML page
// ============================================================

function resultPage(title, message, color) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Picnic Social</title>
  <style>
    body { font-family: Georgia, serif; background: #fdf8f5; margin: 0; padding: 40px 20px; text-align: center; color: #3b2018; }
    .card { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px 28px; border: 1px solid #f0ddd5; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    h1 { color: ${color}; margin: 0 0 12px; font-size: 26px; }
    p { font-size: 15px; line-height: 1.6; color: #5a4a3e; margin: 0; }
    .footer { margin-top: 24px; font-size: 12px; color: #8a7060; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <p class="footer">Picnic Social · pspicnicsocial.ca</p>
  </div>
</body>
</html>`.trim();
  return HtmlService.createHtmlOutput(html);
}

// ============================================================
// Owner notification (with Approve / Decline buttons)
// ============================================================

function sendOwnerNotification(data) {
  const subject = `🧺 New Order Pending Approval — ${data.orderNumber}`;
  const approveUrl = getActionUrl('approve', data.orderNumber);
  const declineUrl = getActionUrl('decline', data.orderNumber);

  const body = `
New order received for Picnic Social — awaiting your approval!

ORDER DETAILS
─────────────────────────────
Order Number:    ${data.orderNumber}
Items:           ${data.items || data.box}
Add-Ons:         ${data.addOns || 'None'}
${data.deliveryFee && data.deliveryFee !== 'N/A' ? 'Delivery Fee:    ' + data.deliveryFee + '\n' : ''}Total:           ${data.total || data.price}
Event Date:      ${data.date}
Time Slot:       ${data.timeslot}
Delivery:        ${data.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}

CUSTOMER INFO
─────────────────────────────
Name:            ${data.name}${data.recipientName ? '\nRecipient:       ' + data.recipientName : ''}
Email:           ${data.email}
Phone:           ${data.phone}
${data.deliveryMethod === 'delivery' ? 'Address:         ' + data.address + ', ' + data.city : ''}

${data.notes ? 'SPECIAL NOTES\n─────────────────────────────\n' + data.notes + '\n' : ''}

APPROVE: ${approveUrl}
DECLINE: ${declineUrl}
`.trim();

  const htmlBody = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #c4705a; padding: 20px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 22px;">🧺 New Order — Awaiting Approval</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px;">Review and approve or decline below.</p>
  </div>
  <div style="background: #fdf8f5; padding: 24px; border: 1px solid #f0ddd5; border-top: none;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #3b2018;">
      <tr><td colspan="2" style="padding: 12px 0 6px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #e8c8b8;">Order Details</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060; width: 140px;">Order Number</td><td style="padding: 8px 0; font-weight: 600;">${data.orderNumber}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Items</td><td style="padding: 8px 0; font-weight: 600;">${data.items || data.box}</td></tr>
      ${data.addOns && data.addOns !== 'None' ? '<tr><td style="padding: 8px 0; color: #8a7060;">Add-Ons</td><td style="padding: 8px 0; font-weight: 600;">' + data.addOns + '</td></tr>' : ''}
      ${data.deliveryFee && data.deliveryFee !== 'N/A' ? '<tr><td style="padding: 8px 0; color: #8a7060;">Delivery Fee</td><td style="padding: 8px 0; font-weight: 600;">' + data.deliveryFee + '</td></tr>' : ''}
      <tr><td style="padding: 8px 0; color: #8a7060;">Total</td><td style="padding: 8px 0; font-weight: 600;">${data.total || data.price}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Event Date</td><td style="padding: 8px 0;">${data.date}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Time Slot</td><td style="padding: 8px 0;">${data.timeslot}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Delivery</td><td style="padding: 8px 0;">${data.deliveryMethod === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</td></tr>

      <tr><td colspan="2" style="padding: 16px 0 6px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #e8c8b8;">Customer Info</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
      ${data.recipientName ? '<tr><td style="padding: 8px 0; color: #8a7060;">Recipient</td><td style="padding: 8px 0; font-weight: 600;">' + data.recipientName + '</td></tr>' : ''}
      <tr><td style="padding: 8px 0; color: #8a7060;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #c4705a;">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #8a7060;">Phone</td><td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #c4705a;">${data.phone}</a></td></tr>
      ${data.deliveryMethod === 'delivery' ? '<tr><td style="padding: 8px 0; color: #8a7060;">Address</td><td style="padding: 8px 0;">' + data.address + ', ' + data.city + '</td></tr>' : ''}
    </table>
    ${data.notes ? '<div style="margin-top: 16px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #e8c8b8;"><strong style="color: #8a7060; font-size: 13px;">Special Notes:</strong><p style="margin: 6px 0 0; color: #3b2018;">' + data.notes + '</p></div>' : ''}

    <div style="margin-top: 24px; text-align: center;">
      <a href="${approveUrl}" style="display: inline-block; background: #2f9e6d; color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 4px 6px;">✓ APPROVE ORDER</a>
      <a href="${declineUrl}" style="display: inline-block; background: #b54040; color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 4px 6px;">✗ DECLINE ORDER</a>
    </div>
    <p style="text-align: center; font-size: 12px; color: #8a7060; margin-top: 16px;">Approve sends the customer a confirmation email. Decline sends a polite cancellation.</p>
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

// ============================================================
// Customer emails
// ============================================================

function sendPendingEmail(data) {
  if (!data.email) return;

  const subject = `🧺 Order Received — ${data.orderNumber} | Picnic Social`;

  const body = `
Hi ${data.name || 'there'},

Thanks for placing your order with Picnic Social! We've received it and will review it shortly.

ORDER SUMMARY
─────────────────────────────
Order Number:    ${data.orderNumber}
Items:           ${data.items || data.box}
Add-Ons:         ${data.addOns || 'None'}
${data.deliveryFee && data.deliveryFee !== 'N/A' ? 'Delivery Fee:    ' + data.deliveryFee + '\n' : ''}Total:           ${data.total || data.price}
Event Date:      ${data.date}
Time Slot:       ${data.timeslot}

WHAT HAPPENS NEXT?
─────────────────────────────
We'll review your order and send a confirmation email shortly. If we have any questions or need to make adjustments, we'll be in touch.

Email: ps.picnic.social@gmail.com
Phone: (519) 984-4174

Thank you for choosing Picnic Social!
With love, The Picnic Social Team
`.trim();

  const htmlBody = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fdf8f5;">
  <div style="background: #c4705a; padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">Order Received!</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">We'll confirm your order shortly</p>
  </div>

  <div style="padding: 28px 24px; border: 1px solid #f0ddd5; border-top: none;">
    <p style="font-size: 15px; color: #3b2018; margin: 0 0 20px;">Hi <strong>${data.name || 'there'}</strong>, thank you for your order! We've received it and will review it shortly. You'll get a confirmation email from us soon.</p>

    <div style="background: #fff8eb; border-left: 4px solid #d9a35b; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 14px; color: #5a4a3e;"><strong>Status:</strong> Awaiting confirmation. We'll be in touch within 24 hours.</p>
    </div>

    <div style="background: #fff; border-radius: 10px; border: 1px solid #e8c8b8; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 12px; font-size: 16px; color: #c4705a; border-bottom: 2px solid #f0ddd5; padding-bottom: 8px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #3b2018;">
        <tr><td style="padding: 6px 0; color: #8a7060; width: 130px;">Order Number</td><td style="padding: 6px 0; font-weight: 600;">${data.orderNumber}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Items</td><td style="padding: 6px 0; font-weight: 600;">${data.items || data.box}</td></tr>
        ${data.addOns && data.addOns !== 'None' ? '<tr><td style="padding: 6px 0; color: #8a7060;">Add-Ons</td><td style="padding: 6px 0; font-weight: 600;">' + data.addOns + '</td></tr>' : ''}
        ${data.deliveryFee && data.deliveryFee !== 'N/A' ? '<tr><td style="padding: 6px 0; color: #8a7060;">Delivery Fee</td><td style="padding: 6px 0; font-weight: 600;">' + data.deliveryFee + '</td></tr>' : ''}
        <tr><td style="padding: 6px 0; color: #8a7060;">Total</td><td style="padding: 6px 0; font-weight: 600; font-size: 16px; color: #c4705a;">${data.total || data.price}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Event Date</td><td style="padding: 6px 0;">${data.date}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Time Slot</td><td style="padding: 6px 0;">${data.timeslot}</td></tr>
      </table>
    </div>

    <div style="text-align: center; padding: 16px 0 8px;">
      <p style="font-size: 13px; color: #8a7060; margin: 0 0 4px;">Need to reach us?</p>
      <p style="font-size: 14px; margin: 0;">
        <a href="mailto:ps.picnic.social@gmail.com" style="color: #c4705a; text-decoration: none;">ps.picnic.social@gmail.com</a>
        &nbsp;·&nbsp;
        <a href="tel:+15199844174" style="color: #c4705a; text-decoration: none;">(519) 984-4174</a>
      </p>
    </div>
  </div>

  <div style="background: #3b2018; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">With love, The Picnic Social Team</p>
    <p style="color: rgba(255,255,255,0.4); margin: 6px 0 0; font-size: 11px;">pspicnicsocial.ca</p>
  </div>
</div>`.trim();

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    replyTo: 'ps.picnic.social@gmail.com',
    name: 'Picnic Social',
  });
}

function sendApprovedEmail(data) {
  if (!data.email) return;

  const subject = `🧺 Order Confirmed — ${data.orderNumber} | Picnic Social`;

  const body = `
Hi ${data.name || 'there'},

Great news — your order has been confirmed! We're excited to prepare something special for you.

ORDER SUMMARY
─────────────────────────────
Order Number:    ${data.orderNumber}
Items:           ${data.items || data.box}
Add-Ons:         ${data.addOns || 'None'}
${data.deliveryFee && data.deliveryFee !== 'N/A' ? 'Delivery Fee:    ' + data.deliveryFee + '\n' : ''}Total:           ${data.total || data.price}
Event Date:      ${data.date}
Time Slot:       ${data.timeslot}
${data.deliveryMethod === 'delivery' ? 'Delivery to:     ' + data.address + ', ' + data.city : 'Pickup'}
${data.recipientName ? 'Recipient:       ' + data.recipientName : ''}
${data.notes ? '\nSpecial Notes: ' + data.notes : ''}

WHAT'S NEXT?
─────────────────────────────
We'll start preparing your order and reach out if we have any questions. If you need to make changes, please contact us as soon as possible.

Email: ps.picnic.social@gmail.com
Phone: (519) 984-4174

Thank you for choosing Picnic Social!
With love, The Picnic Social Team
`.trim();

  const htmlBody = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fdf8f5;">
  <div style="background: #c4705a; padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">Your Order is Confirmed!</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Picnic Social</p>
  </div>

  <div style="padding: 28px 24px; border: 1px solid #f0ddd5; border-top: none;">
    <p style="font-size: 15px; color: #3b2018; margin: 0 0 20px;">Hi <strong>${data.name || 'there'}</strong>, great news — your order has been confirmed! We're excited to prepare something special for you.</p>

    <div style="background: #ecf7f1; border-left: 4px solid #2f9e6d; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 14px; color: #2f6f4f;"><strong>✓ Confirmed</strong> — We've got everything we need to prepare your order.</p>
    </div>

    <div style="background: #fff; border-radius: 10px; border: 1px solid #e8c8b8; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 12px; font-size: 16px; color: #c4705a; border-bottom: 2px solid #f0ddd5; padding-bottom: 8px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #3b2018;">
        <tr><td style="padding: 6px 0; color: #8a7060; width: 130px;">Order Number</td><td style="padding: 6px 0; font-weight: 600;">${data.orderNumber}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Items</td><td style="padding: 6px 0; font-weight: 600;">${data.items || data.box}</td></tr>
        ${data.addOns && data.addOns !== 'None' ? '<tr><td style="padding: 6px 0; color: #8a7060;">Add-Ons</td><td style="padding: 6px 0; font-weight: 600;">' + data.addOns + '</td></tr>' : ''}
        ${data.deliveryFee && data.deliveryFee !== 'N/A' ? '<tr><td style="padding: 6px 0; color: #8a7060;">Delivery Fee</td><td style="padding: 6px 0; font-weight: 600;">' + data.deliveryFee + '</td></tr>' : ''}
        <tr><td style="padding: 6px 0; color: #8a7060;">Total</td><td style="padding: 6px 0; font-weight: 600; font-size: 16px; color: #c4705a;">${data.total || data.price}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Event Date</td><td style="padding: 6px 0;">${data.date}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Time Slot</td><td style="padding: 6px 0;">${data.timeslot}</td></tr>
        <tr><td style="padding: 6px 0; color: #8a7060;">Delivery</td><td style="padding: 6px 0;">${data.deliveryMethod === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</td></tr>
        ${data.deliveryMethod === 'delivery' ? '<tr><td style="padding: 6px 0; color: #8a7060;">Address</td><td style="padding: 6px 0;">' + data.address + ', ' + data.city + '</td></tr>' : ''}
        ${data.recipientName ? '<tr><td style="padding: 6px 0; color: #8a7060;">Recipient</td><td style="padding: 6px 0;">' + data.recipientName + '</td></tr>' : ''}
      </table>
      ${data.notes ? '<div style="margin-top: 12px; padding: 10px; background: #fdf8f5; border-radius: 6px; border: 1px solid #f0ddd5;"><strong style="color: #8a7060; font-size: 12px; text-transform: uppercase;">Special Notes</strong><p style="margin: 4px 0 0; color: #3b2018; font-size: 14px;">' + data.notes + '</p></div>' : ''}
    </div>

    <div style="background: #fff; border-radius: 10px; border: 1px solid #e8c8b8; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 8px; font-size: 16px; color: #c4705a;">What's Next?</h2>
      <p style="font-size: 14px; color: #3b2018; margin: 0; line-height: 1.6;">We'll start preparing your order and reach out if we have any questions. If you need to make changes, please contact us as soon as possible.</p>
    </div>

    <div style="text-align: center; padding: 16px 0 8px;">
      <p style="font-size: 13px; color: #8a7060; margin: 0 0 4px;">Need to reach us?</p>
      <p style="font-size: 14px; margin: 0;">
        <a href="mailto:ps.picnic.social@gmail.com" style="color: #c4705a; text-decoration: none;">ps.picnic.social@gmail.com</a>
        &nbsp;·&nbsp;
        <a href="tel:+15199844174" style="color: #c4705a; text-decoration: none;">(519) 984-4174</a>
      </p>
      <p style="margin: 8px 0 0;">
        <a href="https://www.instagram.com/ps.picnic_social/" style="color: #c4705a; text-decoration: none; font-size: 13px;">@ps.picnic_social</a>
      </p>
    </div>
  </div>

  <div style="background: #3b2018; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">With love, The Picnic Social Team</p>
    <p style="color: rgba(255,255,255,0.4); margin: 6px 0 0; font-size: 11px;">pspicnicsocial.ca</p>
  </div>
</div>`.trim();

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    replyTo: 'ps.picnic.social@gmail.com',
    name: 'Picnic Social',
  });
}

function sendDeclinedEmail(data) {
  if (!data.email) return;

  const subject = `Regarding Your Picnic Social Order — ${data.orderNumber}`;

  const body = `
Hi ${data.name || 'there'},

Thank you so much for your interest in ordering from Picnic Social. Unfortunately, we're unable to fulfill your order at this time.

ORDER REFERENCE
─────────────────────────────
Order Number:    ${data.orderNumber}
Requested Date:  ${data.date}

This may be due to limited availability, scheduling conflicts, or being outside our delivery area. We'd love the opportunity to serve you in the future — please reach out and we'll do our best to accommodate.

Email: ps.picnic.social@gmail.com
Phone: (519) 984-4174

Warm regards,
The Picnic Social Team
`.trim();

  const htmlBody = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fdf8f5;">
  <div style="background: #c4705a; padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">Regarding Your Order</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Picnic Social</p>
  </div>

  <div style="padding: 28px 24px; border: 1px solid #f0ddd5; border-top: none;">
    <p style="font-size: 15px; color: #3b2018; margin: 0 0 16px;">Hi <strong>${data.name || 'there'}</strong>,</p>
    <p style="font-size: 15px; color: #3b2018; margin: 0 0 20px; line-height: 1.6;">Thank you so much for your interest in ordering from Picnic Social. Unfortunately, we're unable to fulfill your order at this time.</p>

    <div style="background: #fff; border-radius: 10px; border: 1px solid #e8c8b8; padding: 16px 20px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 13px; color: #8a7060;">Order Reference</p>
      <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #3b2018;">${data.orderNumber}</p>
      ${data.date ? '<p style="margin: 6px 0 0; font-size: 13px; color: #5a4a3e;">Requested for: ' + data.date + '</p>' : ''}
    </div>

    <p style="font-size: 14px; color: #3b2018; margin: 0 0 16px; line-height: 1.6;">This may be due to limited availability, scheduling conflicts, or being outside our delivery area. We'd love the opportunity to serve you in the future — please reach out and we'll do our best to accommodate.</p>

    <div style="text-align: center; padding: 16px 0 8px;">
      <p style="font-size: 14px; margin: 0;">
        <a href="mailto:ps.picnic.social@gmail.com" style="color: #c4705a; text-decoration: none;">ps.picnic.social@gmail.com</a>
        &nbsp;·&nbsp;
        <a href="tel:+15199844174" style="color: #c4705a; text-decoration: none;">(519) 984-4174</a>
      </p>
    </div>
  </div>

  <div style="background: #3b2018; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">Warm regards, The Picnic Social Team</p>
    <p style="color: rgba(255,255,255,0.4); margin: 6px 0 0; font-size: 11px;">pspicnicsocial.ca</p>
  </div>
</div>`.trim();

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    replyTo: 'ps.picnic.social@gmail.com',
    name: 'Picnic Social',
  });
}

// ============================================================
// Test function — run manually in script editor to verify setup
// ============================================================

function testSetup() {
  const testData = {
    orderNumber: 'PS-TEST-' + Date.now().toString(36).toUpperCase(),
    items: 'Classic Box x2, Fruit Platter x1',
    addOns: 'Fresh Flowers ($50)',
    deliveryFee: '$15',
    total: '$220',
    date: 'May 1, 2026',
    timeslot: '11:00 AM – 1:00 PM',
    deliveryMethod: 'delivery',
    name: 'Test Customer',
    email: 'ps.picnic.social@gmail.com',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Windsor',
    notes: 'This is a test order',
  };

  writeToSheet(testData);
  sendOwnerNotification(testData);
  sendPendingEmail(testData);
  Logger.log('Test order sent! Order #' + testData.orderNumber);
}
