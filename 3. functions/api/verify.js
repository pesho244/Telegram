export async function onRequestPost({ request, env }) {
  try {
    const { token } = await request.json();

    // PUT YOUR REAL TELEGRAM GROUP LINK HERE
    const TELEGRAM_LINK = "https://t.me/YOUR_GROUP_OR_INVITE_LINK";

    const formData = new FormData();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );
    const outcome = await result.json();

    if (outcome.success) {
      return Response.json({ success: true, telegramUrl: TELEGRAM_LINK });
    }
    return Response.json({ success: false }, { status: 400 });
  } catch (err) {
    return Response.json({ success: false }, { status: 500 });
  }
}
