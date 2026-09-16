# Theme

Product visual source of truth for mobile design is Fintech light/dark:

- Index: `.superdesign/design-system.md`
- Today: `.superdesign/design-system-fintech.md`
- Onboarding: `.superdesign/design-system-fintech-onboarding.md`

The graphite / electric-blue Apple system is retired
(`.superdesign/archive/design-system-apple-hig.md`). Do not use it.

Expo onboarding code still has leftover graphite tokens in
`apps/expo/src/theme/tokens.ts`. That is implementation debt, not the brand.
Web still uses create-t3-turbo magenta tokens in `tooling/tailwind/theme.css`.
Do not use magenta or graphite as the mobile brand.

## Compact token summary — Fintech (use this)

| Token | Light | Dark |
| --- | --- | --- |
| Outer canvas | `#E8E7EF` | `#050506` |
| In-app field | `#F7F6FA` | `#0D0D0F` |
| Top wash | `#F8ECEC` blush | `#211719` wine |
| Ink | `#0E0C0D` | `#F7F6FA` |
| Muted | `#6F6B76` | `#9C99A3` |
| Surface / nav | `#FFFFFF` | `#19191C` |
| Hairline | `#ECEAF1` / `#E7E5EC` | `#2B2A30` |
| Feature card | `#101010` | ivory `#F4F3F7` |
| Feature text | `#FFFFFF` | `#0E0C0D` |
| Quiet chip | `#EEEAF8` | `#242329` |
| Lime spark | `#C6D24A` | `#C6D24A` |
| Positive / kept | `#53B25D` | `#74C982` |
| Primary CTA | `#0E0C0D` | `#F4F3F7` |
| Secondary link | `#1D7EFF` | `#72A7FF` |
| Display font | Plus Jakarta Sans extra-bold | same |
| Interface font | Plus Jakarta Sans | same |
| Viewport | 390 × 844 | same |
| Horizontal padding | 20pt | same |
| Feature card radius | 28–32pt | same |
| Capsule CTA | 52pt, radius 999 | same |
| Bottom nav | 64pt, 28pt corners, 4 tabs | same |

Type: money 40/44 extra-bold tabular · title 28/34 extra-bold · body 15/22 · caption 12/16 medium · pill 14/18 semibold.

## Compact token summary — Expo/web leftover (do not use for new mobile UI)

Expo onboarding leftover graphite: background `#0F1115`, tint `#2F80FF`,
Manrope / Inter. Web magenta: primary oklch(0.5605 0.1911 350). Expo splash
light `#E4E4E7`, dark `#18181B`.

## Raw: Expo styles

`apps/expo/src/styles.css`:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";

@import "nativewind/theme";

@import "@discipline/tailwind-config/theme";
```

## Raw: shared Tailwind theme (scaffold)

See `tooling/tailwind/theme.css` for the full magenta oklch token set and `@theme inline` mappings. Fonts on web are Geist Sans / Geist Mono (`apps/nextjs/src/app/layout.tsx`). Expo has no custom font loaders yet.

## Raw: Next.js styles

`apps/nextjs/src/app/styles.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@discipline/tailwind-config/theme";

@source "../../../../packages/ui/src/*.{ts,tsx}";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant light (&:where(.light, .light *));
@custom-variant auto (&:where(.auto, .auto *));
```
