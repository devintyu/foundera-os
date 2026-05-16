import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getUserTrackAndSave } from "@/lib/ai/with-tracking";
import { checkAILimits } from "@/lib/ai/check-limits";

const MOCK_DATA = {
  demographics:
    "Age 28-42, predominantly male (60/40 split), college-educated professionals earning $75K-$150K annually. Urban and suburban dwellers in major metro areas. Tech-savvy early adopters who spend 3+ hours daily online. Many are in mid-career transitions or side-hustling toward entrepreneurship.",
  psychographics:
    "Achievement-oriented with a strong desire for autonomy and financial freedom. Values continuous learning and personal growth. Feels stuck in the corporate 'golden handcuffs' and craves meaningful work. Follows thought leaders on Twitter/X and LinkedIn. Consumes podcasts and online courses regularly. Believes in leveraging technology and systems to create leverage.",
  pain_points: [
    "Feeling trapped in a 9-to-5 with no clear path to financial independence",
    "Overwhelmed by information overload — too many courses, gurus, and conflicting advice",
    "Fear of failure and public embarrassment if their business doesn't work",
    "Lack of a supportive community who understands their entrepreneurial ambitions",
    "Struggling to find a profitable niche that aligns with their skills and interests",
    "Time poverty — juggling job, family, and side projects with no margin",
  ],
  desires: [
    "Build a location-independent business that generates $10K+/month",
    "Achieve financial freedom and leave their corporate job within 12-18 months",
    "Gain recognition as an expert or thought leader in their chosen niche",
    "Create a lifestyle with more flexibility, travel, and time with family",
    "Build something meaningful that creates real impact for others",
  ],
  objections: [
    "I don't have enough time with my full-time job and family commitments",
    "I've tried other programs before and they didn't work for me",
    "I'm not sure I have the skills or expertise to build a real business",
    "The market is too saturated — there's too much competition already",
    "I can't afford to invest in another program right now",
    "What if this is just another overhyped course that doesn't deliver?",
  ],
  emotional_triggers: [
    "The Sunday night dread of going back to a job that doesn't fulfill them",
    "Seeing peers and online personalities living the lifestyle they dream of",
    "The fear of looking back in 10 years and regretting not taking action",
    "The excitement of imagining what life looks like with true financial freedom",
    "The frustration of knowing they're capable of more but feeling stuck",
    "The desire to provide a better life for their family and be a role model",
  ],
};

const SYSTEM_PROMPT = `You are a world-class customer psychology expert and audience research specialist.
Build a detailed customer persona based on the given inputs and return your response as a JSON object with the following structure:
{
  "demographics": "Detailed demographic profile (3-4 sentences)",
  "psychographics": "Detailed psychographic profile including values, beliefs, and behaviors (3-4 sentences)",
  "pain_points": ["array of 5-7 specific pain points"],
  "desires": ["array of 4-6 core desires and goals"],
  "objections": ["array of 5-7 common objections to buying"],
  "emotional_triggers": ["array of 5-7 emotional triggers that drive action"]
}
Return ONLY valid JSON, no markdown or extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { allowed, remaining } = await checkAILimits();
    if (!allowed) {
      return NextResponse.json(
        { error: "AI credit limit reached. Upgrade your plan for more.", remaining },
        { status: 429 }
      );
    }

    const { persona_name, industry, ideal_customer } = await req.json();

    if (!persona_name || !industry || !ideal_customer) {
      return NextResponse.json(
        { error: "Persona name, industry, and ideal customer are required" },
        { status: 400 }
      );
    }

    const userMessage = `Build a detailed customer persona:
Persona Name: ${persona_name}
Industry/Niche: ${industry}
Ideal Customer Description: ${ideal_customer}

Create a comprehensive audience profile including demographics, psychographics, pain points, desires, objections, and emotional triggers.`;

    try {
      const aiResponse = await routeAI({
        agentType: "audience_analyst",
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
        maxTokens: 4096,
      });

      const parsed = JSON.parse(aiResponse.content);
      await getUserTrackAndSave(
        aiResponse.tokensUsed,
        "audience_analyst",
        persona_name,
        parsed,
        { persona_name, industry, ideal_customer }
      );
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(MOCK_DATA);
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to process audience research request" },
      { status: 500 }
    );
  }
}
