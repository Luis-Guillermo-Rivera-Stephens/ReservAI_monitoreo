async function sendFailedChecks(failed_cases) {
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
            html: "Hay instancias de ReservAI que no están funcionando correctamente, por favor revisa el log para más detalles.\n\n" + failed_cases,
            text: "Hay instancias de ReservAI que no están funcionando correctamente, por favor revisa el log para más detalles.\n\n" + failed_cases
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

module.exports = sendFailedChecks;