import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Message = { role: "system" | "user" | "assistant"; content: string };

type ChatCompletionsResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = payload?.query;
    const history: Array<{ role: "user" | "assistant"; content: string }> = payload?.history || [];

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured on the backend" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build messages array with conversation history
    const messages: Message[] = [
      {
        role: "system",
        content: `You are Viva AI Tutor, an intelligent and friendly educational assistant. Your role is to:
- Explain concepts clearly with step-by-step breakdowns
- Adapt explanations to the learner's level based on their questions
- Use examples, analogies, and bullet points for clarity
- Remember context from the conversation to provide relevant follow-ups
- Encourage curiosity and deeper understanding
- Be patient, supportive, and enthusiastic about learning

Keep responses focused and helpful. Use markdown formatting for better readability.`,
      },
    ];

    // Add conversation history (limit to last 20 messages to avoid token limits)
    const recentHistory = history.slice(-20);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add the current user query
    messages.push({ role: "user", content: query });

    console.log(`Processing query with ${recentHistory.length} history messages`);

    const gatewayResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.4,
      }),
    });

    if (!gatewayResp.ok) {
      if (gatewayResp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (gatewayResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add more credits and try again." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const t = await gatewayResp.text();
      console.error("AI gateway error:", gatewayResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error. Please try again." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = (await gatewayResp.json()) as ChatCompletionsResponse;
    const content = data?.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({
        response: content || "I received your message but couldn't generate a response.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("Error in ai-chat function:", error);
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
