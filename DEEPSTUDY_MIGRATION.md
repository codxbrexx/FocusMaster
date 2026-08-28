# DeepStudy — FocusMaster Migration Map

## Purpose

This document defines what is being kept, redesigned, extended, or intentionally left unchanged while converting FocusMaster into DeepStudy.

## Current Baseline

The current FocusMaster frontend is already structured around React 19 + TypeScript + Vite, with React Router, React Query, Zustand, contexts, services, reusable components, Vitest, and Playwright. The application has routes for dashboard, tasks, Pomodoro, rooms, leaderboard, analytics, clock, Spotify, calendar, study, settings, profile, and authentication. Admin routes also exist and should not be accidentally removed. fileciteturn9file0L2-L2

The frontend dependency set already includes Tailwind CSS 4, Framer Motion, Radix UI, Lucide, Recharts, Socket.IO client, Zustand, React Query, Vitest, and Playwright. Therefore the redesign should primarily use the existing stack instead of introducing a new UI framework. fileciteturn7file0L2-L2

The backend already contains controllers for AI, analytics, authentication, feedback, leaderboard, rooms, sessions, Spotify, study profiles, and tasks. The backend also uses Express, MongoDB/Mongoose, Google GenAI, Socket.IO, JWT, Multer, and related infrastructure. fileciteturn1file0L2-L2 fileciteturn14file0L2-L2

## Feature Mapping

| Existing FocusMaster capability | DeepStudy presentation | Backend/data behavior |
|---|---|---|
| Dashboard / main workspace | Full-screen focus canvas | Preserve |
| Pomodoro timer | Large centered timer + timer modal | Preserve |
| Stopwatch | Timer modal tab | Preserve |
| Tags | Centered compact selector | Preserve |
| Tasks | Focus-linked task UI / redesigned Kanban | Preserve |
| Analytics | Activities Summary modal | Preserve |
| Session history | Review Sessions timeline | Preserve |
| Spotify | Lower-left media card | Preserve |
| Backgrounds/scenes | Set your focus scene modal | Preserve / extend |
| Friends | Focus friends modal | Preserve |
| Rooms | Focus-room experience | Preserve |
| Leaderboard | Global/Friends leaderboard modal | Preserve |
| Profile | Right-side profile panel | Preserve |
| Account menu | Compact top-right dropdown | Preserve |
| Settings | Side-panel/modal settings | Preserve |
| Study/AI | Focused AI/study panels | Preserve |
| Calendar | Consistent DeepStudy utility surface | Preserve |
| Clock | Peripheral focus utility | Preserve |
| Admin | Separate admin experience | Preserve |

## What Changes

### Visual layer

The existing visual system is replaced with the DeepStudy reference direction:

- full-screen photographic focus scenes
- large central timer
- compact peripheral utilities
- near-black modals
- right-side profile panel
- compact account dropdown
- screenshot-matching analytics/leaderboard/friends surfaces
- restrained green status accent
- white/off-white typography
- no gradients

### Interaction model

The main experience becomes a focus canvas. Features that were previously presented as normal dashboard sections should be progressively disclosed through modals, side panels, popovers, and utility docks where the screenshots indicate that pattern.

### Branding

Replace visible FocusMaster product branding with DeepStudy branding in the user-facing application. Keep internal identifiers temporarily where changing them would create unnecessary risk; rename them only as part of a deliberate cleanup.

## What Does Not Change

Do not change these simply because the UI is being redesigned:

- authentication model
- JWT behavior
- Google OAuth flow
- MongoDB schema without a real requirement
- timer/session calculations
- analytics calculations
- leaderboard ranking logic
- room membership logic
- friendship relationships
- Spotify authorization/integration
- AI backend behavior
- existing API contracts
- security middleware
- admin permissions/RBAC
- testing infrastructure

## New/Extended UI Abstractions

Create reusable presentation components rather than feature-specific one-off markup:

```text
DeepStudyShell
FocusCanvas
TopUtilityBar
FocusTimer
TagSelector
UtilityDock
ModalShell
SidePanel
TimerModeModal
MediaCard
ScenePicker
FriendsModal
ActivitySummaryModal
LeaderboardModal
AccountMenu
ProfilePanel
```

## State Strategy

Use existing Zustand/context state for client-side state and existing React Query/services for server state. Do not make every modal independently fetch the same resource.

A central overlay controller is recommended so only one major overlay is active at a time unless a specific flow requires nesting.

## Asset Strategy

The supplied screenshots are references, not assets to copy into the application. Implement their composition using the application's own scene/background assets and properly licensed assets.

Scene assets should have:

- stable IDs
- display names
- category
- source/preview
- optional motion metadata

## Known Existing Problems

The current maintenance notes explicitly identify:

- timer reload reverting to 25 minutes
- state/settings reverting to defaults after reload
- slow application performance
- Spotify connection/synchronization work
- timer warning/end beep work
- Kanban date update issue

These should be carried into DeepStudy tracking rather than hidden during the redesign. fileciteturn10file0L2-L2

## Recommended Repository Strategy

If DeepStudy is intended to become a separate public repository, first stabilize the redesign in a branch or fork of FocusMaster. After the UI and behavior are verified, create the DeepStudy repository and preserve Git history when possible.

Do not copy the code manually into a blank repository before the redesign is stable; that makes it harder to track regressions and existing behavior.

## Acceptance Rule

A feature is considered migrated only when both are true:

1. It behaves like the original FocusMaster feature.
2. Its visual presentation follows the DeepStudy screenshot direction.

A visually accurate screen that breaks the original feature is not complete. A functionally correct screen that ignores the screenshot is also not complete.
