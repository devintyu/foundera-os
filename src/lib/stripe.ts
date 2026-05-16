import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  starter: { name: "Starter", price: 29, priceId: "price_starter_monthly" },
  pro: { name: "Pro", price: 79, priceId: "price_pro_monthly" },
  business: { name: "Business", price: 199, priceId: "price_business_monthly" },
  elite: { name: "Elite", price: 499, priceId: "price_elite_monthly" },
} as const;

export type PlanId = keyof typeof PLANS;
