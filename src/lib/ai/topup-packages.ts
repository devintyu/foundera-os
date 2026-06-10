export interface TopupPackage {
  id: string;
  name: string;
  priceUsd: number;
  priceMyr: number;
  credits: number;
  stripePriceId: string;
}

export const TOPUP_PACKAGES: TopupPackage[] = [
  {
    id: "topup_small",
    name: "Top-Up Small",
    priceUsd: 10,
    priceMyr: 49,
    credits: 1000,
    stripePriceId: process.env.STRIPE_TOPUP_SMALL_PRICE_ID ?? "",
  },
  {
    id: "topup_growth",
    name: "Top-Up Growth",
    priceUsd: 29,
    priceMyr: 129,
    credits: 3500,
    stripePriceId: process.env.STRIPE_TOPUP_GROWTH_PRICE_ID ?? "",
  },
  {
    id: "topup_pro",
    name: "Top-Up Pro",
    priceUsd: 79,
    priceMyr: 359,
    credits: 12000,
    stripePriceId: process.env.STRIPE_TOPUP_PRO_PRICE_ID ?? "",
  },
  {
    id: "topup_agency",
    name: "Top-Up Agency",
    priceUsd: 199,
    priceMyr: 899,
    credits: 35000,
    stripePriceId: process.env.STRIPE_TOPUP_AGENCY_PRICE_ID ?? "",
  },
];

export function getTopupPackage(id: string): TopupPackage | undefined {
  return TOPUP_PACKAGES.find((p) => p.id === id);
}
