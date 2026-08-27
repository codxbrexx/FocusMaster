const nodemailer = require("nodemailer");
const logger = require("./logger");

/**
 * Send an email using SMTP if configured, or log to console in dev/test fallback.
 *
 * @param {Object} options
 * @param {string} options.to 
 * @param {string} options.subject 
 * @param {string} options.text 
 * @param {string} [options.html] 
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  const from = EMAIL_FROM || '"FocusMaster" <noreply@focusmaster.app>';

  // If SMTP config is present, send actual email via Nodemailer
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html || text,
      });

      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      logger.error("Failed to send email via SMTP:", { error: err.message });
      throw err;
    }
  }

  // Fallback for Development/Testing when SMTP credentials are not set
  logger.info("----------------------------------------");
  logger.info(`[Email Service Simulation]`);
  logger.info(`To: ${to}`);
  logger.info(`Subject: ${subject}`);
  logger.info(`Message: ${text}`);
  logger.info("----------------------------------------");

  return { success: true, simulated: true };
};

module.exports = sendEmail;
