import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { responses, blueprint } = body;

    // Save onboarding responses
    if (responses && Array.isArray(responses)) {
      const rows = responses.map(
        (r: { question_key: string; answer: unknown }) => ({
          user_id: user.id,
          question_key: r.question_key,
          answer: r.answer,
        })
      );
      await supabase.from("onboarding_responses").insert(rows);
    }

    // Save founder blueprint
    if (blueprint) {
      await supabase.from("founder_blueprints").insert({
        user_id: user.id,
        niche_suggestions: blueprint.niche_suggestions,
        business_model: blueprint.business_model,
        positioning: blueprint.positioning,
        offer_ideas: blueprint.offer_ideas,
        audience_strategy: blueprint.audience_strategy,
        funnel_recommendations: blueprint.funnel_recommendations,
        next_steps: blueprint.next_steps,
      });
    }

    // Update profile
    const profileUpdate: Record<string, unknown> = {
      onboarding_completed: true,
    };
    if (body.fullName) profileUpdate.full_name = body.fullName;
    if (body.role) profileUpdate.role = body.role;
    if (body.experienceLevel)
      profileUpdate.experience_level = body.experienceLevel;
    if (body.industry) profileUpdate.industry = body.industry;
    if (body.revenueStage) profileUpdate.revenue_stage = body.revenueStage;
    if (body.goals) profileUpdate.goals = body.goals;
    if (body.bottleneck) profileUpdate.current_bottleneck = body.bottleneck;

    await supabase.from("profiles").update(profileUpdate).eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
