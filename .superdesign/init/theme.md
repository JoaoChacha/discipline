# Theme

Product visual source of truth for mobile design is `.superdesign/design-system-apple-hig.md` (Discipline Stake graphite / electric blue). The Expo scaffold still uses create-t3-turbo magenta tokens in `tooling/tailwind/theme.css` and a `#c03484` stack header. Do not use the magenta scaffold as the mobile brand.

## Compact token summary — Discipline Stake (use this)

| Token | Value |
| --- | --- |
| Background | `#0F1115` |
| Primary surface | `#1B1E25` |
| Secondary surface | `#15181E` |
| Primary label | `#F5F7FA` |
| Secondary label | `#A8AFBA` |
| Separator | `#343943` |
| Tint / primary action | `#2F80FF` |
| Pressed tint | `#1769E8` |
| Trust container | `#142B4F` |
| Positive | `#36C98F` |
| Pending | `#F2A93B` |
| Destructive | `#FF5A65` |
| Card radius | 20pt |
| Card edge | `rgba(47,128,255,.16)` |
| CTA height | 52pt |
| Horizontal padding | 20pt |
| Display font | Manrope 700 |
| Interface font | Inter |
| Viewport | 390 × 844 |

Type scale: Large title 34/41 bold · Title 2 22/28 bold · Headline 17/22 semibold · Body 17/22 · Subheadline 15/20 · Footnote 13/18 · Caption 12/16.

## Compact token summary — Expo/web scaffold (do not use for new mobile UI)

Light: background oklch(0.9875 0.0045 314.8), primary oklch(0.5605 0.1911 350) magenta, radius 0.75rem.
Dark: background oklch(0.1836 0.0111 311.9), primary oklch(0.6747 0.1492 345.9).
Expo header: `#c03484`. Splash light `#E4E4E7`, dark `#18181B`. Android adaptive icon background `#1F104A`.

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
