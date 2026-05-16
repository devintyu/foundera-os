import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) {
          console.error("Missing metadata in checkout session");
          break;
        }

        const subscriptionId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const item = sub.items.data[0];
        const periodStart = item?.current_period_start ?? Math.floor(Date.now() / 1000);
        const periodEnd = item?.current_period_end ?? Math.floor(Date.now() / 1000);

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            plan: planId,
            status: "active",
            current_period_start: new Date(periodStart * 1000).toISOString(),
            current_period_end: new Date(periodEnd * 1000).toISOString(),
          },
          { onConflict: "user_id" }
        );

        await supabaseAdmin
          .from("profiles")
          .update({ plan: planId })
          .eq("id", userId);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const updItem = subscription.items.data[0];
        const updStart = updItem?.current_period_start ?? Math.floor(Date.now() / 1000);
        const updEnd = updItem?.current_period_end ?? Math.floor(Date.now() / 1000);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status === "active" ? "active" : "past_due",
            current_period_start: new Date(updStart * 1000).toISOString(),
            current_period_end: new Date(updEnd * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
          .select("user_id")
          .single();

        if (sub?.user_id) {
          await supabaseAdmin
            .from("profiles")
            .update({ plan: "starter" })
            .eq("id", sub.user_id);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
