import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ── Safeguards ── */
const MAX_MESSAGES        = 10;   // max conversation turns per session
const MAX_MESSAGE_LENGTH  = 300;  // max chars per user message
const RATE_LIMIT_REQUESTS = 15;   // max requests per IP per window
const RATE_LIMIT_WINDOW   = 5 * 60_000; // 5 minutes in ms

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_REQUESTS) return false;
  entry.count++;
  return true;
}

function errorResponse(message: string, status: number) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain" } });
}

const SYSTEM_PROMPT = `You are a chat assistant on Phasin Ploypicha's custom website. Answer visitor questions about Phasin naturally and conversationally.

FACTS ABOUT PHASIN:
Name: Phasin Ploypicha 
Degree: Graduate in Computer Engineering from Mahidol 
university Interanltional College.
Role: Creative developer and freelancer based in Bangkok, Thailand
Bio: Freelancer who genuinely loves the craft. Works independently on products that solve real problems for real people and customer. Experience in web development and custom solutions. Delivered a full MVP for a car rental system in 1 months that can handle more than 200 cars, currently building a hotel website. Always open to new projects and collaborations.

Services: Web design and web development (full-stack, frontend, UI/UX)

Projects:
- Custom websites — clean, fast personal sites with modern design, starting at 2,000 Baht, timeline depends on the scale of the work. Free custom designs for all projects. 
- Car rental system — full platform managing 200+ cars with booking and real-time availability, built with Next.js. Timeline depends on the scale of the work. Price starting at 5,000 Baht
- LINE Automation CRM — automated CRM on LINE managing leads, messages, and customer journeys
- Hotel website — currently in progress, room browsing and booking flow

Contact: phasin.plo@gmail.com
GitHub: github.com/PhasinAom
Instagram: instagram.com/a.aom__

STRICT RULES FOR HOW YOU WRITE:
- Plain text only. No asterisks, no bold, no bullet points, no numbered lists, no markdown of any kind.
- Write in short natural sentences, like a real person chatting.
- Maximum 3 sentences per reply. Be direct.
- If listing multiple things, use commas or "and" — never symbols or line breaks.
- If asked about pricing, say rates depend on the project and to reach out at phasin.plo@gmail.com.
- If asked about availability or other project that are not in the scope of this website, say Phasin is open to new projects. Do not hallucinate.
- Never invent information not listed above.`;

async function notifyTelegram(userMessage: string, aiReply: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text =
    `💬 *New visitor question*\n\n` +
    `*Visitor:* ${userMessage}\n\n` +
    `*AI replied:* ${aiReply}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return errorResponse("You've sent too many messages. Please wait a few minutes or contact Phasin directly at phasin.plo@gmail.com.", 429);
  }

  const { messages } = await req.json();

  // Validate conversation length
  if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
    return errorResponse("Conversation too long. Please clear the chat to continue, or reach Phasin directly at phasin.plo@gmail.com.", 400);
  }

  // Validate latest message length
  const userMessage = messages[messages.length - 1]?.content ?? "";
  if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
    return errorResponse("Empty message.", 400);
  }
  if (userMessage.length > MAX_MESSAGE_LENGTH) {
    return errorResponse(`Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`, 400);
  }

  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages,
  });

  let fullReply = "";
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullReply += event.delta.text;
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
      notifyTelegram(userMessage, fullReply);
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
