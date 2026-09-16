# Discipline Stake — Commitment creation, light + dark

This system extends the approved fintech onboarding and Today language into the
five-step wizard that creates a commitment. It is the same consumer-neobank
voice as `.superdesign/design-system-fintech-onboarding.md` and
`.superdesign/design-system-fintech.md`; it introduces no third look.

The wizard is entered from two places and is identical in both:

- First commitment: the onboarding CTA "Create my first commitment" or an
  empty Today.
- New: the "New" tab on the signed-in Today screen.

Only the final success line differs ("Your first commitment is live" vs
"Commitment is live").

## Product rules

- A commitment has a specific action, deadline, monetary stake, selected cause,
  and trusted verifier.
- Complete and verify: the full stake is released back to the user.
- Miss: a 10% company fee is deducted from the stake and the remainder goes to
  that commitment's selected charity or group.
- The fee and charity outcome are shown live while choosing the stake and
  again before confirmation.
- Charity selection and group allocation happen separately for every
  commitment. A group must allocate exactly 100%.
- The verifier is chosen for every commitment. The verifier can never be the
  owner.
- Inviting a verifier is always available. With no friends, the verifier step
  is the invite screen. With friends, the list still carries a persistent
  "Invite a person" action. Both use the same invite form.
- A stake is only held once the verifier has accepted. A pending invite keeps
  the commitment unheld and says so plainly.
- No money is held until the user reviews and confirms every term.
- Tone is factual and reassuring. Never use shame, gambling, punishment, or
  casino language. Never call a pending invite a blocker or a failure.

Consistency note: the shipped Expo onboarding screens and the Today design
system still describe an 80/20 split. Commitment creation follows the 10%
company fee rule above. Those older surfaces are out of scope for this system.

## Demo content

- Owner: Maya. Currency: EUR.
- Action: "Run 5 km before work". Deadline: tomorrow, 7:30 AM.
- Stake: `€25.00` (presets `€10` / `€25` / `€50` / `€100`, plus custom).
- Complete: `+€25.00` returned. Miss: `€2.50` company fee, `€22.50` to the
  selected cause.
- Cause group: Water.org `60%` and Girls Who Code `40%`.
- Verifier: Alex Chen (accepted friend). Invite example: "Sam Rivera",
  `sam@example.com`, shown as "Pending — invite sent".
- Payment: Apple Pay (default) or Visa ···· 4242. Nothing is charged unless
  the commitment is missed.

## Shared visual language

- Viewport: 390 × 844, 20pt horizontal safe padding.
- Type: Plus Jakarta Sans throughout.
- Display: 34/39 extra-bold, tight tracking.
- Money: 40/44 extra-bold, tabular numerals.
- Body: 15/22 regular; captions: 12/16 medium; pill labels: 14/18 semibold.
- Capsule CTAs: 52pt tall, full radius.
- Feature card: 28–32pt radius with one dominant financial number or promise.
- Supporting surface: 24pt radius, hairline border.
- Inputs: 56pt tall, 16pt radius, hairline border, ink text, muted placeholder.
  Focused input uses a 2pt ink border. Never a colored glow.
- Chips (suggestions, presets): 36pt capsules, quiet chip fill, ink text.
  Selected chip: ink fill with field-colored text.
- Selection rows (friends, charities): 64pt rows, circular avatar or 40pt
  rounded-square icon tile, trailing circular radio. Selected row shows a lime
  check inside an ink circle.
- Allocation bars: 8pt lime bars on a quiet track, total shown as a caption.
- Icons: restrained Lucide line icons inside circles or 40pt rounded squares.
- Signature accent: lime `#C6D24A`.
- Wizard navigation: 44pt top row, centered `N / 05`, Back on steps 02–05,
  Close on step 01. No Skip on any step; every step is required.
- Progress: 4pt track with a lime leading/end marker.
- Primary CTA is pinned above the safe area. Disabled CTA uses 40% opacity of
  its normal fill; never grey it out with a different hue.
- No bottom tab bar inside the wizard.
- No graph-paper background lines. No gradient cards; the only gradient is the
  subtle ambient top wash.
- Motion: 360ms horizontal push, 4px content reveal, subtle press scale.
  Respect `prefers-reduced-motion`.

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
- Pending state: ink text on quiet chip, never amber or red.

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
- Pending state: ink text on quiet chip, never amber or red.

## Screen architecture

### 01 — Action and deadline (`01 / 05`)

- Nav: Close, `01 / 05`, no Skip.
- Eyebrow: `WHAT WILL YOU DO`.
- Title: "Name the action."
- Body: "Be specific enough that a friend can tell whether it happened."
- Title input, placeholder "Run 5 km before work".
- Suggestion chips: "Run 5 km before work", "No sugar for 7 days",
  "Ship the portfolio site", "Call Mum on Sunday".
- Deadline surface: date row ("Tomorrow, 17 Sep") and time row ("7:30 AM"),
  each with a chevron. Caption: "Proof is due by this time."
- CTA: "Set the stake".

### 02 — Stake (`02 / 05`)

- Eyebrow: `PUT SOMETHING ON IT`.
- Title: "Choose your stake."
- Dominant feature card with `€25.00` money display and the label
  "Held once your verifier accepts".
- Preset chips: `€10`, `€25` (selected), `€50`, `€100`, "Custom".
- Outcome surface, two rows:
  - "Complete it" — `+€25.00` in the positive color, "Returned after
    verification."
  - "Miss it" — `€22.50` to your cause, with a small info icon. Caption:
    "A 10% company fee (€2.50) is applied to the stake and the rest is donated
    to the charity or charities you choose next."
- Outcome numbers update live with the selected preset.
- CTA: "Choose a cause".

### 03 — Cause (`03 / 05`)

- Eyebrow: `WHERE A MISSED STAKE GOES`.
- Title: "Choose a cause every time."
- Body: "Pick one vetted charity, or build a group and split it to 100%."
- Segmented toggle: "One charity" / "A group" (group selected).
- Surface: "Your group" header with "100% allocated" in the positive color.
  Rows: Water.org (droplets tile, `60%`), Girls Who Code (code tile, `40%`),
  each with a lime allocation bar.
- Quiet "Add a charity" row with a circular plus.
- CTA: "Choose a verifier".

### 04 — Verifier (`04 / 05`)

Invite is a first-class path, not a fallback buried in an empty state.

Variant A — friends exist:

- Eyebrow: `WHO CHECKS THE PROOF`.
- Title: "Pick someone you trust."
- Selection surface: Alex Chen (selected, "Verified 3 commitments"),
  Priya Nair ("Friend since May"), Jonas Weber ("Friend since June").
- Persistent "Invite a person" row directly under the list header, with a
  lime 40pt rounded-square tile and a plus icon. It is always visible, never
  only after a long list.
- Privacy recap surface: sees your action, deadline, and proof; never sees
  payment details or other activity; you choose a verifier for each
  commitment.
- CTA: "Review and confirm".

Variant B — no friends:

- Eyebrow: `WHO CHECKS THE PROOF`.
- Title: "Invite someone you trust."
- Body: "A verifier confirms your proof. Add one person to continue."
- No empty list, no grey placeholder rows.
- Invite form on the page: "Name" input and "Email" input, then a caption
  "They get an email with what they will and will not see."
- Same privacy recap surface as Variant A.
- CTA: "Send invite". After sending, the CTA becomes "Review and confirm" and
  the invitee appears above the form as "Sam Rivera · Pending — invite sent".

Shared invite form (opened from Variant A):

- Bottom sheet, 32pt top corners, grabber, title "Invite a person".
- "Name" and "Email" inputs, the same privacy caption, and a "Send invite"
  capsule.
- On send it closes and the friend list gains "Sam Rivera · Pending — invite
  sent" as the selected verifier.

### 05 — Review and confirm (`05 / 05`)

Structure: an editable receipt. Every term can be changed from this screen,
the missed-stake split is itemised, and consent sits in the footer.

- Eyebrow: `REVIEW EVERY LINE`.
- Title: "Check your terms." Body: "Change anything before you confirm."
- Terms surface, three rows with a 10pt uppercase label, a 13pt value, a muted
  caption, and a secondary-link "Edit" that returns to that step:
  - `ACTION` — "Run 5 km before work" · "Proof due tomorrow, 7:30 AM" (→ 01).
  - `CAUSE` — "Water.org · Girls Who Code" · "60% / 40% group" (→ 03).
  - `VERIFIER` — "Alex Chen" · "Accepted friend · sees only your proof", or
    "Sam Rivera" · "Pending — invite sent" (→ 04).
- Stake ledger surface: header "Stake €25.00" with "Edit" (→ 02), then four
  lines separated by a hairline:
  - "If you complete it — returned to you" `+€25.00` (bold, positive color).
  - "If you miss it — company fee (10%)" `−€2.50`.
  - "Water.org (60%)" `€13.50`.
  - "Girls Who Code (40%)" `€9.00`.
  - Amounts are tabular and update live with the stake.
- Payment: label row "Pay with" with the caption "Charged only if you miss",
  then two selectable tiles side by side (18pt radius, hairline border, ink
  border when selected, small trailing radio):
  - Apple Pay — ink 34pt rounded-square mark with the Apple Pay logo, caption
    "Face ID". Selected by default when available.
  - Visa ···· 4242 — card icon in a quiet circle, caption "09/28".
  - No other payment brands or wallets appear on this screen.
- Footer: consent capsule with a circular checkbox, vertically centered with
  the label "I understand these terms, the 10% company fee, and who verifies my
  proof.", then the CTA, then the disclosure.
- CTA with Apple Pay selected: Apple logo + "Confirm with Apple Pay" on the
  standard ink capsule (ivory in dark). With a card selected: "Confirm and hold
  €25.00". Disabled until the checkbox is selected.
- Disclosure: "No money is held until you confirm." With a pending verifier:
  "Your stake is held once Sam accepts the invite."

Alternative A (one dominant contract card with cause/verifier tiles) was
explored and not chosen; it remains on the canvas for reference.

### Held (success beat)

- Same field, no progress rail, no nav.
- Large lime circle with an ink check.
- Title: "Commitment is live." First-time copy: "Your first commitment is
  live."
- Body: "€25.00 is held on Run 5 km before work. Alex Chen will review your
  proof."
- CTA: "Back to Today".

## Stream invariants

- Light and dark keep exactly the same hierarchy, copy, spacing, component
  geometry, and interaction model.
- Only semantic tokens invert. Lime remains lime in both.
- Do not bring back the graphite/electric-blue system or the 80/20 ring.
- Do not use gradients as decorative cards; the only gradient is the subtle
  ambient top wash.
