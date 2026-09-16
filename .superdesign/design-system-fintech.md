# Discipline Stake — Fintech home (inspired by Finpay)

Inspired by [Fintech Landing page design animation](https://dribbble.com/shots/25572577-Fintech-Landing-page-design-animation) (Finpay / Bankify). This is the signed-in **Today** language only. Do not overwrite onboarding (`.superdesign/design-system-apple-hig.md`). Do not copy Finpay or Bankify names, logos, or marketing copy.

## Product

Discipline Stake: commit to an action, hold a stake, appoint a verifier. Complete + verify → money kept. Miss → 80% to that commitment’s charity, 20% platform fee. Calm, factual. No gambling, shame, or neon gradients.

## Visual direction

Light consumer-neobank, not graphite iOS. Airy almost-white field, one oversized black money card, pill actions, activity rows. The landing chrome is light; the product moment is a soft-black balance card on white.

### Color

#### Light

- Page canvas: cool lavender-gray `#E8E7EF` behind the phone; in-app field `#F7F6FA`
- Flat field only — no graph-paper grid or background lines
- Soft blush wash behind the greeting: `#F8ECEC`
- Ink: `#0E0C0D`
- Muted body: `#6F6B76`
- Hairline / chip: `#ECEAF1`
- Soft-black card: `#101010`
- Card secondary: `rgba(255,255,255,0.62)`
- Primary pill (landing Sign up): `#1D7EFF`
- Black pill (Get started): `#0E0C0D`
- Ghost pill on black card: `rgba(255,255,255,0.12)` stroke/fill
- Lime spark tile: `#C6D24A`
- Credit / kept: `#53B25D`
- Debit / at risk: ink, never red-as-shame
- Lavender chip: `#EEEAF8`

#### Dark

- Outer canvas: `#050506`; in-app field: `#0D0D0F`
- Flat field with a restrained top wine wash `#211719`
- Primary ink: `#F7F6FA`; muted: `#9C99A3`
- Surface and bottom nav: `#19191C`; hairline: `#2B2A30`
- Feature stake card: ivory `#F4F3F7` with ink `#0E0C0D`
- Quiet chip: `#242329`
- Lime spark remains `#C6D24A`
- Positive / kept: `#74C982`
- Geometry, hierarchy, content, and navigation match light mode exactly

### Typography

Geometric grotesque: Plus Jakarta Sans (Satoshi / Geist stand-in). Extra-bold tight headlines. Large tabular money. Tiny captions (“Current stake”, “Recent”).

- Display money: 40/44 extra-bold, tracking -2
- Title: 28/34 extra-bold
- Body: 15/22 regular
- Caption: 12/16 medium
- Pill label: 14/18 semibold

### Components

- Capsule buttons only (999px radius)
- Black hero card ~28–32px radius, white type, two ghost pills
- Lime 40px rounded-square icon tile for one promo row
- Circular avatars / marks in the activity list
- No 80/20 conic ring, no graphite cards, no 52pt electric-blue rectangles, no Manrope-on-graphite
- Compact white capsule bottom nav: 64pt tall, 28pt corners, hairline border, no shadow
- Four equal-width columns with identical icon and label baselines
- New commitment is a normal tab with an outlined circular plus, not a raised action
- Active tab: ink 20pt icon, bold 11pt label, lime 4pt dot
- Inactive tabs: `#6F6B76`, 20pt icons, aligned labels

### Layout (390 × 844)

- 20pt horizontal padding
- Greeting + lavender status chip + icon actions
- One black stake card (the only dark surface)
- One promo row
- Recent list (deadline, verifier, miss allocation)
- Floating bottom nav; no second CTA row above it

## Screen — Today

- Chip: “Proof due”
- Title: “Good morning, Maya”
- Black card: “Discipline” · **€25.00** · “Held on Run 5 km” · pills Submit proof / Details
- Promo: lime tile · “Your next proof” · “Tomorrow, 7:30 AM · Alex Chen”
- Recent: verifier, deadline, if missed €20 / €5
- Bottom nav: Today (active, lime dot), Commitments, New, You
- Submit proof stays on the stake card

Use only these fonts, colors, and pill/card styles. Maintain matching light and
dark streams; invert semantic tokens without changing hierarchy or geometry.
Do not revive the graphite onboarding Today.
