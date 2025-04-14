export default async function handler(req, res) {
  const VERIFY_TOKEN = process.env.IG_VERIFY_TOKEN;

  if (!VERIFY_TOKEN) {
    console.error("❌ Missing IG_VERIFY_TOKEN in environment variables.");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (req.method === 'GET') {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query || {};

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified successfully.");
      return res.status(200).send(challenge);
    } else {
      console.warn("❌ Webhook verification failed.");
      return res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    try {
      const eventBody = req.body || {};
      console.log('📥 Webhook Event Received:', JSON.stringify(eventBody, null, 2));
      return res.status(200).end();
    } catch (error) {
      console.error('❌ POST handler error:', error);
      return res.status(500).json({ error: 'Webhook handler failed' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
