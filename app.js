require('dotenv').config();
const conectarDB = require('./connectDB');
const query = require('./query');
const sendErrorEmail = require('./sendError');
const axios = require('axios');
const sendFailedChecks = require('./sendFailedChecks');

async function main() {
    let successful_checks = 0;
    let failed_checks = 0;
    let success_cases = [];
    let failed_cases = [];

    try {
        const pool = await conectarDB();
        const result = await pool.query(query);
        console.log(result.rows);

        for (const row of result.rows) {
            const { id, account_id, account_name, health_webhook, health_auth_key } = row;
            const check = await axios.get(health_webhook, {
                headers: {
                    'Health-Auth-Key': health_auth_key
                }
            });
            if (check.status === 200) {
                successful_checks++;
                success_cases.push({
                    id: id,
                    account_id: account_id,
                    account_name: account_name,
                    health_webhook: health_webhook,
                    health_auth_key: health_auth_key
                });
            } else {
                failed_checks++;
                failed_cases.push(row);
            }
        }
        console.log(`✅ Successful checks: ${successful_checks}`);
        console.log(`❌ Failed checks: ${failed_checks}`);  

        if (failed_checks > 0) {
            const result = await sendFailedChecks(failed_cases);
            if (result.success) {
                console.log('✅ Failed checks sent successfully');
            } else {
                throw new Error(result.error);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        await sendErrorEmail(error.message + '\n\n' + error.stack);
        throw error;
    }
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
