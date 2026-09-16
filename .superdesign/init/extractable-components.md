# Extractable Components

No reusable Expo layout components exist yet. The current home is a one-file scaffold. Skip Superdesign component extraction for this target.

## Layout Components

None in the Expo app. Intended future shell (design only):

- TodayTabBar — Source: not implemented — Category: layout — Description: Bottom tabs Today / Commitments / Profile
- TodayHeader — Source: not implemented — Category: layout — Description: Greeting, Today title, New Commitment, avatar

## Basic Components

Web-only primitives in `packages/ui` (Button, Input, Label, Separator, Field, Toast). They use magenta scaffold tokens and should not be extracted for the mobile Today screen.

Onboarding Superdesign drafts already encode the brand cards, 52pt CTA, 80/20 stake ring, and progress rail. Reuse those visually via the shared project / `execute-flow-pages` rather than converting unused web components.
