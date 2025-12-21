module.exports = `
SELECT t.id, a.id as account_id, a.name as account_name, t.health_webhook, t.health_auth_key
FROM public.technical_info t 
JOIN public.accounts a ON t.account_id = a.id
`;