const createTransporter = require('../config/email');
const { logger } = require('../utils/logger');

exports.sendOrderConfirmation = async (order, customer) => {
  try {
    const transporter = await createTransporter();

    // Format items for email
    const itemsList = order.orderItems.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.menuItem.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">£${item.price.toFixed(2)}</td>
      </tr>`
    ).join('');

    // Create HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center; color: #333;">
          <h1>Order Confirmation</h1>
          <p>Order #${order.orderNumber}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Thank you for your order, ${customer.name}!</h2>
          <p>We've received your order and are working on it right away.</p>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Restaurant:</strong> ${order.restaurant.name}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Estimated Time:</strong> ${order.orderType === 'DELIVERY' ? '30-45 minutes' : '15-20 minutes'}</p>
            ${order.orderType === 'DELIVERY' ? `<p><strong>Delivery Address:</strong> ${order.address}, ${order.city} ${order.postcode}</p>` : ''}
            ${order.scheduledTime ? `<p><strong>Scheduled For:</strong> ${new Date(order.scheduledTime).toLocaleString()}</p>` : ''}
          </div>
          
          <h3>Your Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 10px;">£${(order.total - (order.deliveryFee || 0) - (order.tip || 0)).toFixed(2)}</td>
              </tr>
              ${order.deliveryFee ? `
              <tr>
                <td style="padding: 10px; text-align: right;">Delivery Fee:</td>
                <td style="padding: 10px;">£${order.deliveryFee.toFixed(2)}</td>
              </tr>` : ''}
              ${order.tip ? `
              <tr>
                <td style="padding: 10px; text-align: right;">Tip:</td>
                <td style="padding: 10px;">£${order.tip.toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                <td style="padding: 10px; font-weight: bold; font-size: 18px;">£${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>If you have any questions about your order, please contact us at: <br />
            <a href="tel:+441234567890">0121 XXX XXXX</a></p>
          </div>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <p>TurkNazz Restaurant</p>
          <p>Authentic Turkish Cuisine in Birmingham</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customer.email,
      subject: `TurkNazz Order Confirmation #${order.orderNumber}`,
      html: htmlContent
    });

    logger.info(`Order confirmation email sent to ${customer.email}`);
    return true;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    return false;
  }
};

exports.sendBookingConfirmation = async (booking, customer) => {
  try {
    const transporter = await createTransporter();

    // Create HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center; color: #333;">
          <h1>Booking Confirmation</h1>
          <p>Booking #${booking.bookingNumber}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Your table is reserved, ${customer.name}!</h2>
          <p>We're looking forward to welcoming you to TurkNazz.</p>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3>Booking Details</h3>
            <p><strong>Restaurant:</strong> ${booking.restaurant.name}</p>
            <p><strong>Address:</strong> ${booking.restaurant.address}, ${booking.restaurant.city} ${booking.restaurant.postcode}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Number of Guests:</strong> ${booking.guests}</p>
            ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3>Need to Change Your Reservation?</h3>
            <p>If you need to modify or cancel your booking, please call us at <a href="tel:+441234567890">0121 XXX XXXX</a> at least 2 hours before your reservation time.</p>
          </div>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <p>TurkNazz Restaurant</p>
          <p>Authentic Turkish Cuisine in Birmingham</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customer.email,
      subject: `TurkNazz Booking Confirmation #${booking.bookingNumber}`,
      html: htmlContent
    });

    logger.info(`Booking confirmation email sent to ${customer.email}`);
    return true;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    return false;
  }
};

exports.sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    const transporter = await createTransporter();

    // Create HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center; color: #333;">
          <h1>Password Reset</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${user.name},</h2>
          <p>You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p>Please click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" style="background-color: #FFC107; color: #333; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="margin-top: 15px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            <p>This password reset link will expire in 10 minutes.</p>
          </div>
          
          <p>If the button above doesn't work, please copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <p>TurkNazz Restaurant</p>
          <p>Authentic Turkish Cuisine in Birmingham</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'TurkNazz - Password Reset',
      html: htmlContent
    });

    logger.info(`Password reset email sent to ${user.email}`);
    return true;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw error;
  }
};

exports.sendWelcomeEmail = async (user) => {
  try {
    const transporter = await createTransporter();

    // Create HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FFC107; padding: 20px; text-align: center; color: #333;">
          <h1>Welcome to TurkNazz!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Hello ${user.name},</h2>
          <p>Thank you for joining TurkNazz! We're delighted to have you as a member of our community.</p>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3>What You Can Do Now</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li><strong>Order Delicious Turkish Food</strong> - Browse our menu and enjoy authentic Turkish cuisine delivered to your door</li>
              <li><strong>Book a Table</strong> - Reserve a table at any of our three convenient locations in Birmingham</li>
              <li><strong>Save Your Favorites</strong> - Create a list of your favorite dishes for quick ordering</li>
              <li><strong>Track Your Orders</strong> - See the status of your current and past orders</li>
            </ul>
          </div>
          
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3>Our Locations</h3>
            <p><strong>TurkNazz Shirley</strong><br />148-150 Stratford Road, Birmingham, B90 3BD</p>
            <p><strong>TurkNazz Moseley</strong><br />107 Alcester Road, Birmingham, B13 8DD</p>
            <p><strong>TurkNazz Sutton Coldfield</strong><br />22 Beeches Walk, Birmingham, B73 6HN</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/menu" style="background-color: #FFC107; color: #333; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
              Explore Our Menu
            </a>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact us at <a href="mailto:info@turknazz.com">info@turknazz.com</a> or call us at <a href="tel:+441234567890">0121 XXX XXXX</a>.</p>
          
          <p>We look forward to serving you!</p>
          <p><em>The TurkNazz Team</em></p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
          <p>TurkNazz Restaurant</p>
          <p>Authentic Turkish Cuisine in Birmingham</p>
          <div style="margin-top: 15px;">
            <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Facebook</a>
            <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Instagram</a>
            <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Twitter</a>
          </div>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to TurkNazz Restaurant!',
      html: htmlContent
    });

    logger.info(`Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    logger.error(`Welcome email sending failed: ${error.message}`);
    return false;
  }
};