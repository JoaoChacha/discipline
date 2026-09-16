# Discipline Stake — Fintech onboarding, light + dark

This system converts the approved Welcome + five-step onboarding flow into the
same consumer-neobank language as the signed-in Today screen. It is inspired by
the referenced Finpay landing animation without copying its identity, logo, or
marketing content.

## Shared product rules

- A commitment has a specific action, deadline, monetary stake, selected cause,
  and trusted verifier.
- Complete and verify: the full stake is released back to the user.
- Miss: a 10% company fee is deducted from the stake and the remainder goes to
  that commitment's selected charity or group.
- The fee and charity outcome are clearly disclosed before confirmation.
- Charity selection and group allocation happen separately for every
  commitment.
- No money is held until the user reviews and confirms every term.
- Tone is factual and reassuring. Never use shame, gambling, punishment, or
  casino language.

## Shared visual language

- Viewport: 390 × 844, 20pt horizontal safe padding.
- Type: Plus Jakarta Sans throughout.
- Display: 34/39 extra-bold, tight tracking.
- Money: 40/44 extra-bold, tabular numerals.
- Body: 15/22 regular; captions: 12/16 medium.
- Capsule CTAs: 52pt tall, full radius.
- Feature card: 28–32pt radius with one dominant financial number or promise.
- Supporting surface: 24pt radius, hairline border.
- Icons: restrained Lucide line icons inside circles or 40pt rounded squares.
- Signature accent: lime `#C6D24A`.
- Navigation: 44pt top row, centered `N / 05`, Back/Close and Skip aligned to
  equal 44pt hit targets.
- Progress: 4pt track with a lime leading/end marker.
- No graph-paper background lines.
- Motion: 360ms horizontal push, 4px content reveal, subtle press scale.
- Respect `prefers-reduced-motion`.

## Light stream

- Field: `#F7F6FA` with a restrained top blush wash `#F8ECEC`.
- Outer canvas: `#E8E7EF`.
- Ink: `#0E0C0D`.
- Muted: `#6F6B76`.
- Surface: `#FFFFFF`.
- Hairline: `#E7E5EC`.
- Feature card: `#101010`; feature text: `#FFFFFF`.
- Quiet chip: `#EEEAF8`.
- Primary CTA: `#0E0C0D` with white text.
- Secondary link: `#1D7EFF`.
- Positive amount: `#53B25D`.

## Dark stream

- Field: `#0D0D0F` with a restrained top wine wash `#211719`.
- Outer canvas: `#050506`.
- Ink: `#F7F6FA`.
- Muted: `#9C99A3`.
- Surface: `#19191C`.
- Hairline: `#2B2A30`.
- Feature card: `#F4F3F7`; feature text: `#0E0C0D`.
- Quiet chip: `#242329`.
- Primary CTA: `#F4F3F7` with ink text.
- Secondary link: `#72A7FF`.
- Positive amount: `#74C982`.

## Screen architecture

### 00 — Welcome

- Brand row: black/ivory circular D mark and “Discipline”.
- Eyebrow: `ACCOUNTABILITY, MADE CLEAR`.
- Title: “Turn intention into action.”
- Financial feature card: “Quit Smoking in 3 months”, `€250.00`, and no
  allocation pills or overflow menu.
- Lime supporting row: “Nothing is held until you confirm.”
- Primary: “Get started”; secondary: “I already have an account”.
- No onboarding progress appears before Get started.

### 01 — Accountability Promise

- Title: “Your commitment, backed by you.”
- Lime promise tile and a dominant feature card: “A promise, not a punishment.”
- Supporting points: “You set the action”, “You choose the stake”, “A trusted
  person verifies”.
- CTA: “See how the stake works”.

### 02 — Money Rules

- Title: “Your money follows the outcome.”
- Dominant `€250.00` stake card.
- Outcomes: `+€250.00` returned after verification; the `€250.00` stake is
  allocated after the company fee if missed.
- A small information icon appears beside the missed stake amount. The
  disclosure below explains that a 10% company fee is applied to the stake and
  the rest is donated to the selected charity or charities.
- CTA: “See charity choices”.

### 03 — Per-commitment Causes

- Title: “Choose a cause every time.”
- White/charcoal surface with Water.org `60%` and Girls Who Code `40%`.
- Lime allocation bars total 100%.
- Explain the choice is made during each commitment setup.
- CTA: “I understand”.

### 04 — Verification and Privacy

- Title: “Proof stays focused and private.”
- Dominant Alex Chen verifier card.
- Three activity-style rows: can see, cannot see, user stays in control.
- CTA: “Review and begin”.

### 05 — Consent and Begin

- Title: “Ready to make it real?”
- Summary rows for action/deadline, the charity outcome after the 10% company
  fee, and cause/verifier.
- Large consent capsule with a circular checkbox. Its selected state uses a
  clear checkmark, and the control is vertically centered with the label text.
- CTA: “Create my first commitment”.
- Footer disclosure: “No money is held until you confirm a commitment.”

## Stream invariants

- Light and dark keep exactly the same hierarchy, copy, spacing, component
  geometry, and interaction model.
- Only semantic tokens invert. Lime remains lime in both.
- Do not bring back the old graphite/electric-blue onboarding system.
- Do not use gradients as decorative cards; the only gradient is the subtle
  ambient top wash.
