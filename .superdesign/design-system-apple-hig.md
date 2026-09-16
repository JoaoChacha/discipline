# Discipline Stake — Apple Human Interface Guidelines

## Product

A signed-in iPhone accountability app. Users commit to an action, place money at stake, and appoint a trusted verifier. The stake is returned after verified completion. After confirmed failure or expiry, 80% is donated to the user's selected vetted charities/nonprofits and 20% is retained as a disclosed platform fee.

Use reassuring, factual language. Avoid gambling imagery, shame, exaggerated rewards, gradients, and decorative illustrations.

During onboarding, explain that users select a vetted charity/nonprofit or a group of them separately for every commitment. Charity selection happens during commitment setup, not as a global onboarding preference. When a group is selected, users allocate 100% of the donation pool between its charities. Show the selected charity/group, 80% donation, and 20% platform-fee allocation before every commitment is confirmed.

### Onboarding shell

The onboarding flow is preceded by a focused welcome screen with product identity, a concise value proposition, “Get started,” and “I already have an account.” It uses the same graphite/electric-blue system but does not show onboarding progress until the user begins.

Every onboarding screen must use the same structural shell:
- 390 × 844 viewport with 20pt horizontal padding
- 44pt top navigation row: back/close, centered “N of 5,” and Skip (blank on final step)
- 4pt progress track directly below navigation
- 28pt top padding before content
- 15pt blue uppercase eyebrow
- 34/40 bold title and 15/22 secondary description
- 16pt-radius elevated graphite content cards
- 52pt electric-blue footer CTA in the same bottom position
- Identical safe-area, horizontal, and footer spacing
- Soft onboarding motion: 520–560ms horizontal pushes with restrained displacement, gentle fades, and 6pt content reveals

## System

Use Apple Human Interface Guidelines as the interaction and accessibility foundation, not as the product's visual identity. Design at 390 × 844 points with correct safe areas, familiar navigation, accessible type roles, and restrained motion, then apply the custom Discipline Stake brand layer below.

### Custom brand layer

- Display typography: Manrope, 700 weight, for major headings and key numbers
- Interface typography: Inter for body copy, labels, buttons, and navigation
- Signature motif: an 80/20 split stake ring representing charity allocation and platform sustainability
- Card identity: 20pt corners, subtle electric-blue edge tint, and graphite depth instead of default iOS grouped-list styling
- Progress identity: a slim “commitment rail” with five softly separated blue segments
- Use electric blue as a focused signal, not generic iOS tint across every interactive element
- Preserve platform-familiar behavior, safe areas, accessibility, and navigation while avoiding a first-party Apple appearance

### Color

Use an Apple-compatible custom dark semantic theme:
- Background: graphite `#0F1115`
- Primary surface: elevated graphite `#1B1E25`
- Secondary grouped surface: `#15181E`
- Primary label: cool white `#F5F7FA`
- Secondary label: `#A8AFBA`
- Separator: `#343943`
- Tint and primary action: electric blue `#2F80FF`
- Pressed tint: `#1769E8`
- Trust/info container: deep blue `#142B4F`
- Positive confirmation: cool mint `#36C98F`, used sparingly
- Pending: cool amber `#F2A93B`
- Destructive only: `#FF5A65`

Render this variant in the custom dark graphite theme. Meet WCAG AA and never encode financial status by color alone. Electric blue is the only dominant accent; mint and amber are semantic status colors, not decorative accents.

### Typography

Use Manrope for major headings and KPI values, with Inter for interface text:
- Large title: 34/41 bold
- Title 2: 22/28 bold
- Headline: 17/22 semibold
- Body: 17/22 regular
- Subheadline: 15/20 regular
- Footnote: 13/18 regular
- Caption: 12/16 regular

Use Dynamic Type roles, sentence case, tabular numerals for money, and concise native iOS copy.

### Components

- Reuse the onboarding card, not iOS grouped lists: 20pt corners, graphite fill `#1B1E25`, electric-blue edge tint
- 15pt blue uppercase eyebrows and Manrope 34/40 titles, same as onboarding
- 44pt minimum touch targets
- Filled electric-blue primary button, 52pt height, matching the onboarding footer CTA
- Capsule status labels only when they improve scanning (amber “Proof needed”)
- Line icons only, restrained: house, list, person, clock, plus
- Bottom tab bar on graphite: Today, Commitments, Profile — electric blue only on the active Today item
- 80/20 stake ring as the recurring brand mark in the header and on the active commitment

### Layout

- 390 × 844 viewport, 20pt horizontal padding (same as onboarding)
- 8pt base spacing rhythm
- Keep the active commitment and Submit Proof CTA above the tab bar
- Safe-area padding at top and above the tab bar
- No magenta scaffold header, no first-party Apple grouped-list chrome

### Motion

- iOS-standard ease-in-out transitions around 250ms
- Subtle press opacity and scale
- No celebratory motion until trusted verification succeeds
- Respect Reduce Motion

## Screen direction — Today (signed-in main)

Replace the archived Apple-native Today exploration. The signed-in main page must look like it belongs to the approved onboarding: same graphite field, Manrope/Inter, 80/20 stake ring, 20pt blue-tinted cards, and 52pt electric-blue CTA.

Content:
- Top row: small 80/20 stake ring, “Discipline Stake”, and a New commitment text button
- 15pt electric-blue eyebrow: TODAY
- Manrope title: “Good morning, Maya.”
- Secondary line: “One commitment needs proof before tomorrow.”
- Elevated “Your progress” card with three KPIs: 7-day streak, 86% completed, €175 money kept
- Active commitment card for “Run 5 km before work”
  - Amber “Proof needed” status
  - Deadline “Tomorrow, 7:30 AM”
  - Stake “€25 held”
  - Verifier “Alex Chen”
  - Compact 80/20 ring
- Outcome rows in the same factual tone as onboarding money rules:
  - Complete it: keep the full €25 after Alex confirms
  - If missed: €20 (80%) to this commitment’s cause, €5 (20%) platform fee
- Footer: 52pt “Submit Proof” CTA, then the tab bar
- Tabs: Today (active), Commitments, Profile

The result must look like an actual iPhone app screen, not a marketing page or a phone mockup. Do not revive the deleted Apple-native Today draft. Use ONLY the fonts, colors, spacing, and component styles defined in this design system. Do not introduce any fonts, colors, or visual styles not in the design system.
