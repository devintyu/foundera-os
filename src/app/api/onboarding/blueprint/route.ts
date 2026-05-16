import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";

interface OnboardingData {
  fullName: string;
  role: string;
  experienceLevel: string;
  industry: string;
  businessDescription: string;
  revenueStage: string;
  goals: string[];
  bottleneck: string;
}

const MOCK_BLUEPRINT = {
  niche_suggestions: [
    "AI-powered productivity tools for solopreneurs",
    "No-code automation consulting for small businesses",
    "Digital transformation advisory for traditional industries",
  ],
  business_model:
    "Service-to-product hybrid: Start with high-touch consulting to validate your approach, then productize your methodology into a digital course + community model. This lets you earn while you build, and ensures your product solves real problems.",
  positioning:
    "The go-to expert who helps ambitious founders leverage AI and automation to run a lean, profitable one-person business -- without the overwhelm of learning everything alone.",
  offer_ideas: [
    "90-Day Founder Accelerator (group coaching + AI toolkit)",
    "Done-For-You Business Blueprint (one-time strategy session + deliverable)",
    "Monthly AI Strategy Retainer (ongoing advisory)",
    "Self-Paced Digital Course: 'Build Your AI-Powered Business in 30 Days'",
    "VIP Day: Full business model + funnel design in one intensive session",
  ],
  audience_strategy:
    "Focus on LinkedIn and Twitter/X where aspiring founders and solopreneurs actively seek business advice. Create short-form educational content showing behind-the-scenes of building with AI. Join and contribute to communities like Indie Hackers, r/Entrepreneur, and relevant Discord servers. Build an email list through a free 'Founder Readiness Assessment' lead magnet.",
  funnel_recommendations:
    "Start with a simple 3-step funnel: (1) Free lead magnet (Founder Blueprint quiz or mini-course) advertised via organic social content, (2) Nurture sequence of 5 emails establishing authority and sharing case studies, (3) Invitation to a low-ticket workshop ($47-97) that naturally upsells to your core offer. Avoid complex funnels early -- focus on one path that converts.",
  next_steps: [
    "Validate your niche by having 10 conversations with potential customers this week -- ask about their biggest struggles and what they'd pay to solve them",
    "Create your lead magnet (Founder Blueprint Assessment) and set up a simple landing page to start building your email list",
    "Launch your first minimum viable offer -- a 60-minute strategy session at $150-300 to start generating revenue and collecting testimonials",
  ],
};

export async function POST(request: Request) {
  try {
    const data: OnboardingData = await request.json();

    const systemPrompt = `You are an elite business strategist and startup advisor. Based on the founder's profile, generate a comprehensive Founder Blueprint.

The founder's profile:
- Name: ${data.fullName}
- Role: ${data.role}
- Experience Level: ${data.experienceLevel}
- Industry: ${data.industry}
- Business Description: ${data.businessDescription}
- Revenue Stage: ${data.revenueStage}
- Goals: ${data.goals.join(", ")}
- Current Bottleneck: ${data.bottleneck}

Generate a personalized Founder Blueprint as a JSON object with these exact keys:
- "niche_suggestions": array of 3 specific, actionable niche ideas tailored to their industry and goals
- "business_model": string with a detailed recommended business model and why it fits them
- "positioning": string with a clear positioning statement they can use
- "offer_ideas": array of 5 specific offer ideas with pricing context
- "audience_strategy": string with detailed audience building strategy
- "funnel_recommendations": string with specific funnel strategy for their stage
- "next_steps": array of exactly 3 prioritized action items they should do this week

Be specific, actionable, and tailored to their exact situation. No generic advice.
Respond with ONLY the JSON object, no markdown fences or extra text.`;

    const userMessage = `Generate my Founder Blueprint based on my profile. I'm a ${data.role} in ${data.industry} at the ${data.revenueStage} stage. My main goals are: ${data.goals.join(", ")}. My biggest bottleneck is: ${data.bottleneck}.`;

    const aiResponse = await routeAI({
      agentType: "market_researcher",
      systemPrompt,
      userMessage,
      maxTokens: 4096,
    });

    const blueprint = JSON.parse(aiResponse.content);

    return NextResponse.json({ blueprint, model: aiResponse.model });
  } catch (error) {
    console.error("Blueprint generation error:", error);

    // Return mock data so the UI still works during development
    return NextResponse.json({
      blueprint: MOCK_BLUEPRINT,
      model: "mock",
      fallback: true,
    });
  }
}
