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

        // Generar HTML amigable
        let htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
                    ⚠️ Instancias de ReservAI con Fallos
                </h2>
                <p style="color: #666; margin-bottom: 30px;">
                    Se detectaron <strong>${failed_cases.length}</strong> instancia(s) que no están funcionando correctamente.
                </p>
        `;

        // Generar texto plano
        let textContent = `⚠️ Instancias de ReservAI con Fallos\n\n`;
        textContent += `Se detectaron ${failed_cases.length} instancia(s) que no están funcionando correctamente.\n\n`;

        failed_cases.forEach((failedCase, index) => {
            const url = failedCase.url || 'N/A';
            const accountName = failedCase.account_name || 'N/A';
            const accountId = failedCase.account_id || 'N/A';
            const healthWebhook = failedCase.health_webhook || 'N/A';

            // HTML para cada caso
            htmlContent += `
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">
                        ${index + 1}. ${url} - ${accountName}
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px; font-weight: bold; color: #333; width: 150px;">Account ID:</td>
                            <td style="padding: 5px; color: #666;">${accountId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; font-weight: bold; color: #333;">Health Webhook:</td>
                            <td style="padding: 5px; color: #666;">${healthWebhook}</td>
                        </tr>
                    </table>
                </div>
            `;

            // Texto plano para cada caso
            textContent += `${index + 1}. ${url} - ${accountName}\n`;
            textContent += `   Account ID: ${accountId}\n`;
            textContent += `   Health Webhook: ${healthWebhook}\n\n`;
        });

        htmlContent += `
                <p style="color: #666; margin-top: 30px; font-size: 12px;">
                    Por favor, revisa estas instancias para más detalles.
                </p>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO + ',' + process.env.EMAIL_TO_2,
            subject: `⚠️ Error en el monitor de ReservAI - ${failed_cases.length} instancia(s) con fallos`,
            html: htmlContent,
            text: textContent
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