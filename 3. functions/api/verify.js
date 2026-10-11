export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { token } = await request.json();
        const SECRET_KEY = env.TURNSTILE_SECRET_KEY;
        
        // ВАЖНО: Замени този линк с твоя истински линк към Telegram канала ти!
        const TELEGRAM_LINK = "https://t.me"; 

        // Заявка към Cloudflare за проверка на токена
        const response = await fetch('https://cloudflare.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(SECRET_KEY)}&response=${encodeURIComponent(token)}`
        });

        const outcome = await response.json();

        if (outcome.success) {
            return new Response(JSON.stringify({ success: true, telegramUrl: TELEGRAM_LINK }), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        return new Response(JSON.stringify({ success: false, error: "Невалидна CAPTCHA" }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
