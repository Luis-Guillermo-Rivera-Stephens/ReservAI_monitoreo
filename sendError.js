async function sendErrorEmail(log) {
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                // Permitir certificados autofirmados (útil para desarrollo)
                // En producción, debería ser false para mayor seguridad
                rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === 'true' ? true : false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO + ',' + process.env.EMAIL_TO_2,
            subject: 'Error en el monitor de ReservAI',
            html: "Hubo un error en el monitor de ReservAI, por favor revisa el log para más detalles.\n\n" + log,
            text: "Error en el monitor de ReservAI\n\n" + log
        };

        await transporter.sendMail(mailOptions);
        // Log de email removido por seguridad
        return {
            success: true
        }
    } catch (error) {
        console.log('❌ EmailManager: error sending verification email:', error);
        return {
            error: error.message,
            success: false
        }
    }
}

module.exports = sendErrorEmail;