// Vercel 서버리스 함수: 브라우저 요청을 받아 OpenRouter로 전달합니다.
// API 키는 서버(환경 변수)에만 있고 브라우저로 노출되지 않습니다.

const SYSTEM_PROMPT = "You are a friendly, helpful assistant. Answer in the user's language.";
const MAX_HISTORY = 20;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY 환경 변수가 설정되지 않았습니다." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages 배열이 필요합니다." });
  }

  const history = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": `https://${req.headers.host || "localhost"}`,
        "X-Title": "chatbotpractice",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openrouter/auto",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || `OpenRouter 오류 (${response.status})`;
      return res.status(response.status).json({ error: message });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply, model: data.model });
  } catch (err) {
    return res.status(502).json({ error: "OpenRouter 요청에 실패했습니다." });
  }
}
