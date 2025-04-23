const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        // Debug: Log environment variables
        console.log('Email config:', {
            user: process.env.EMAIL_USER,
            hasPassword: !!process.env.EMAIL_PASSWORD
        });

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendBookingConfirmation(bookingDetails) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: bookingDetails.email,
            subject: 'Bus Seat Booking Confirmation',
            html: `
                <h1>Seat Booking Confirmation</h1>
                <p>Dear ${bookingDetails.passengerName},</p>
                <p>Your seat booking has been confirmed. Here are your booking details:</p>
                <ul>
                    <li>Seat Number: ${bookingDetails.seatNumber}</li>
                    <li>Passenger Name: ${bookingDetails.passengerName}</li>
                    <li>Phone Number: ${bookingDetails.phoneNumber}</li>
                    <li>Email: ${bookingDetails.email}</li>
                </ul>
                <p>Thank you for choosing our service!</p>
                <p>Best regards,<br>Bus Booking Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, message: 'Failed to send email' };
        }
    }
}

module.exports = EmailService; 