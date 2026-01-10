import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      // Non-fatal: we return a 200 with an error payload so the client doesn't crash on non-2xx
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = payload?.query;

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

    const gatewayResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are Viva AI Tutor. Explain concepts clearly, step-by-step, and adapt to the learner. Use concise bullets and examples when helpful.",
          },
          { role: "user", content: query },
        ],
        temperature: 0.3,
      }),
    });

    if (!gatewayResp.ok) {
      // Return 200 + {error} so supabase.functions.invoke doesn't throw a transport error for non-2xx.
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

    // Return 200 + {error} to avoid the client treating it like a 404/500 transport failure.
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
