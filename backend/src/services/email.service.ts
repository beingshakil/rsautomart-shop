import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmation = async (
  to: string,
  orderNumber: string,
  totalAmount: number,
  items: { name: string; quantity: number; price: number }[]
): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email confirmation: No credentials set.');
    return;
  }
  const itemsHtml = items
    .map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>৳${item.price}</td></tr>`)
    .join('');

  await transporter.sendMail({
    from: `"RS Automart" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Order Confirmed!</h2>
        <p>Thank you for your order. Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #1a1a2e; color: white;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size: 18px;"><strong>Total: ৳${totalAmount}</strong></p>
        <p>We will notify you when your order is shipped.</p>
        <p style="color: #666;">— RS Automart Team</p>
      </div>
    `,
  });
};

export const sendNewOrderNotification = async (
  orderNumber: string,
  totalAmount: number,
  customerName: string
): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping admin notification: No credentials set.');
    return;
  }

  await transporter.sendMail({
    from: `"RS Automart" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Order Received - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Order Received!</h2>
        <p><strong>Order:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Total:</strong> ৳${totalAmount}</p>
      </div>
    `,
  });
};
