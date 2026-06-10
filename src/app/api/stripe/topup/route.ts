import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const { priceId, credits } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!priceId || !credits) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
      metadata: {
        userId: user.id,
        user_id: user.id,
        credits: credits.toString(),
        topupCredits: credits.toString(),
        type: 'topup',
      },
    })

    const amount = credits <= 1000 ? 10 : credits <= 3500 ? 29 : credits <= 12000 ? 79 : 199

    await getSupabaseAdmin().from('topup_transactions').insert({
      user_id: user.id,
      stripe_payment_id: (session.payment_intent as string) || session.id,
      topup_package_name: `topup_${credits}`,
      amount_usd: amount,
      amount_myr: 0,
      ai_credits_added: credits,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Top-up error:', error)
    return NextResponse.json({
      error: 'Error creating checkout',
      details: message
    }, { status: 500 })
  }
}
