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
  starter: { name: "Starter", price: 29, priceMyr: 129, priceId: " price_1TXhgcAhY0LpGPLllxkHSmSM", credits: 1000 },
  pro: { name: "Pro", price: 79, priceMyr: 359, priceId: " price_1TXhNkAhY0LpGPLlfflvLevv", credits: 4000 },
  business: { name: "Agency", price: 199, priceMyr: 899, priceId: " price_1TXhh5AhY0LpGPLlUbPrccOy", credits: 12000 },
  elite: { name: "Enterprise", price: 499, priceMyr: 2299, priceId: " price_1TXhhWAhY0LpGPLlzs9UJUR4", credits: 50000 },
} as const;

export type PlanId = keyof typeof PLANS;

