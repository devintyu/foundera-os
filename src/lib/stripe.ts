import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  starter: { name: "Starter", price: 29, priceId: " price_1TXhgcAhY0LpGPLllxkHSmSM" },
  pro: { name: "Pro", price: 79, priceId: " price_1TXhNkAhY0LpGPLlfflvLevv" },
  business: { name: "Business", price: 199, priceId: " price_1TXhh5AhY0LpGPLlUbPrccOy" },
  elite: { name: "Elite", price: 499, priceId: " price_1TXhhWAhY0LpGPLlzs9UJUR4" },
} as const;

export type PlanId = keyof typeof PLANS;

