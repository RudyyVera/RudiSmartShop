const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Missing OPENROUTER_API_KEY in environment variables.",
    });
  }

  const {
    model = "openai/gpt-4o-mini",
    messages,
    temperature = 0.7,
    max_tokens = 500,
  } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "'messages' must be a non-empty array." });
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_TITLE || "RudiSmartShop",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenRouter API request failed.",
        details: data,
      });
    }

    return res.status(200).json({
      id: data.id,
      model: data.model,
      created: data.created,
      choices: data.choices,
      usage: data.usage,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected server error while calling OpenRouter.",
      details: error.message,
    });
  }
}
