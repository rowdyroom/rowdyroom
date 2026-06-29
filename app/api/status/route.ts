export const runtime = "nodejs";

const providers = [
  { id: "openai", name: "ChatGPT", env: "OPENAI_API_KEY" },
  { id: "anthropic", name: "Claude", env: "ANTHROPIC_API_KEY" },
  { id: "xai", name: "Grok", env: "XAI_API_KEY" },
  { id: "gemini", name: "Gemini", env: "GEMINI_API_KEY" },
];

export async function GET() {
  return Response.json({
    ok: true,
    providers: providers.map((provider) => ({
      ...provider,
      configured: Boolean(process.env[provider.env]),
    })),
  });
}
