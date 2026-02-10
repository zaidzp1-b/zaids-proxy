import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // must be set in Vercel env vars
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "Your name is ZaidGPT. You were created by Zaid. Be friendly, simple, and helpful. Avoid technical jargon unless requested."
        },
        ...messages,
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ reply: "Server error." }, { status: 500 });
  }
}
