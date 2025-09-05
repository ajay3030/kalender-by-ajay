// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

/* Create reusable transporter (Gmail, SendGrid, Mailgun, etc.) */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/* Compile templates once */
function loadTemplate(name) {
  const file = fs.readFileSync(path.join(__dirname, `../templates/${name}.hbs`), 'utf8');
  return handlebars.compile(file);
}
const templates = {
  confirmation: loadTemplate('bookingConfirmation'),
  reminder: loadTemplate('bookingReminder'),
  cancellation: loadTemplate('bookingCancellation')
};

/* Send booking confirmation to BOTH client and host */
async function sendBookingConfirmation(booking, eventType) {
    if (process.env.SKIP_MAIL === 'true') return; 
  const host = eventType.userId;
  const data = {
    clientName: booking.clientName,
    eventTitle: eventType.title,
    dateTime: booking.bookingDateTime,
    duration: booking.duration,
    timezone: booking.clientTimezone,
    cancellationLink: `${process.env.FRONTEND_URL}/booking/${booking._id}/cancel?token=${booking.cancellationToken}`
  };

  const clientMail = {
    from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
    to: booking.clientEmail,
    subject: `Booking confirmed – ${eventType.title}`,
    html: templates.confirmation({ ...data, isHost: false })
  };

  const hostMail = {
    from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
    to: host.email,
    subject: `New booking – ${eventType.title}`,
    html: templates.confirmation({ ...data, isHost: true, clientEmail: booking.clientEmail })
  };

  await Promise.all([transporter.sendMail(clientMail), transporter.sendMail(hostMail)]);
}

/* Send cancellation emails */
async function sendCancellationEmail(booking) {
    if (process.env.SKIP_MAIL === 'true') return; 
  const eventType = await booking.populate('eventTypeId').then(b => b.eventTypeId);
  const data = {
    clientName: booking.clientName,
    eventTitle: eventType.title,
    dateTime: booking.bookingDateTime
  };

  const mails = [
    {
      from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
      to: booking.clientEmail,
      subject: `Booking cancelled – ${eventType.title}`,
      html: templates.cancellation(data)
    },
    {
      from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
      to: eventType.userId.email,
      subject: `Booking cancelled – ${eventType.title}`,
      html: templates.cancellation(data)
    }
  ];

  await Promise.all(mails.map(m => transporter.sendMail(m)));
}

module.exports = { sendBookingConfirmation, sendCancellationEmail };