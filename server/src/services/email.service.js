const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: process.env.SMTP_USER || "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: `"Maison Luxe" <${process.env.EMAIL_FROM}>`, to, subject, html });
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error(`Email failed to ${to}: ${err.message}`);
  }
};

const sendOrderConfirmation = async (user, order) => {
  const itemRows = order.items.map((item) =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a;text-align:right">$${Number(item.price).toFixed(2)}</td>
    </tr>`
  ).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0d0c0a;font-family:Georgia,serif;color:#e8e0d0">
      <div style="max-width:600px;margin:40px auto;background:#111009;border:1px solid #2a2410">
        <div style="background:#111009;padding:40px;text-align:center;border-bottom:1px solid #C9A84C30">
          <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:6px;color:#e8e0d0">MAISON LUXE</h1>
          <div style="color:#C9A84C;font-size:10px;letter-spacing:4px;margin-top:4px">— ORDER CONFIRMED —</div>
        </div>
        <div style="padding:40px">
          <p style="color:#b0a898">Dear ${user.name},</p>
          <p style="color:#b0a898;line-height:1.8">
            Thank you for your order. We have received your purchase and our team is preparing it with care.
          </p>
          <div style="background:#0d0c0a;border:1px solid #2a2a2a;padding:24px;margin:24px 0">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#C9A84C">ORDER DETAILS</p>
            <p style="margin:0;color:#6b6355">Order #: <span style="color:#e8e0d0">${order.orderNumber}</span></p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="border-bottom:1px solid #C9A84C40">
                <th style="padding:8px;text-align:left;font-size:10px;letter-spacing:2px;color:#C9A84C;font-weight:normal">ITEM</th>
                <th style="padding:8px;text-align:center;font-size:10px;letter-spacing:2px;color:#C9A84C;font-weight:normal">QTY</th>
                <th style="padding:8px;text-align:right;font-size:10px;letter-spacing:2px;color:#C9A84C;font-weight:normal">PRICE</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="text-align:right;margin-top:16px;padding-top:16px;border-top:1px solid #C9A84C30">
            <span style="font-size:20px;color:#C9A84C">Total: $${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
        <div style="padding:24px 40px;text-align:center;border-top:1px solid #2a2a2a;color:#4a4438;font-size:12px">
          Questions? Contact us at support@maisonluxe.com
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({ to: user.email, subject: `Order Confirmed — ${order.orderNumber}`, html });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0d0c0a;font-family:Georgia,serif;color:#e8e0d0">
      <div style="max-width:600px;margin:40px auto;background:#111009;border:1px solid #2a2410;padding:48px">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:6px;color:#e8e0d0;margin-bottom:4px">MAISON LUXE</h1>
        <div style="color:#C9A84C;font-size:10px;letter-spacing:4px;margin-bottom:32px">— WELCOME —</div>
        <p style="color:#b0a898;line-height:1.8">Dear ${user.name},</p>
        <p style="color:#b0a898;line-height:1.8">
          Welcome to Maison Luxe. Your account has been created and you now have access to our exclusive collection of luxury goods.
        </p>
        <a href="${process.env.CLIENT_URL}/shop" style="display:inline-block;margin-top:24px;padding:14px 36px;background:#C9A84C;color:#0a0a0a;text-decoration:none;font-size:11px;letter-spacing:3px;font-weight:600">
          EXPLORE COLLECTION
        </a>
      </div>
    </body>
    </html>
  `;
  await sendMail({ to: user.email, subject: "Welcome to Maison Luxe", html });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail };
