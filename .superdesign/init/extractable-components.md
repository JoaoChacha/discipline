# Extractable Components

No reusable Expo layout components exist yet. The current home is a one-file
scaffold. Skip Superdesign component extraction for this target.

## Layout Components

None in the Expo app. Intended Fintech shell (design only):

- TodayTabBar — Source: not implemented — Category: layout — Description: Compact capsule bottom nav, four equal tabs: Today, Commitments, New, You. Active tab uses ink icon, bold 11pt label, lime 4pt dot.
- TodayHeader — Source: not implemented — Category: layout — Description: Greeting, status chip, icon actions

## Basic Components

Web-only primitives in `packages/ui` (Button, Input, Label, Separator, Field, Toast). They use magenta scaffold tokens and should not be extracted for the mobile Today screen.

Onboarding and Today Superdesign drafts already encode the Fintech feature
card, lime spark tile, capsule CTAs, and four-tab nav. Reuse those visually
via the shared project / `execute-flow-pages` rather than converting unused
web components.
