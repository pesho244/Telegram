export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const { token } = await request.json();

        const SECRET_KEY = env.TURNSTILE_SECRET_KEY;
        // ТУК СЛОЖИ ИСТИНСКИЯ СИ ЛИНК КЪМ ТЕЛЕГРАМ
        const TELEGRAM_LINK = "https://t.me"; 

        const formData = new FormData();
        formData.append('secret', SECRET_KEY);
        formData.append('response', token);

        const url = 'https://cloudflare.com';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();

        if (outcome.success) {
            return new Response(JSON.stringify({ success: true, telegramUrl: TELEGRAM_LINK }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: false, error: "Invalid CAPTCHA" }), { status: 400 });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
