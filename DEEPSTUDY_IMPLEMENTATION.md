# DeepStudy — Implementation Guide

## Goal

Transform the current FocusMaster codebase into DeepStudy by keeping the existing product logic and redesigning the frontend to match the supplied reference screenshots exactly.

Current FocusMaster already has a React/TypeScript frontend, route-level lazy loading, React Query, Zustand, contexts, reusable components, services, backend APIs, MongoDB, authentication, timers, analytics, rooms, leaderboard, Spotify, study/AI, tests, and E2E infrastructure. Reuse these systems instead of rebuilding them.

The current repository uses React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Zustand, React Router, React Query, Axios, Radix UI, Lucide icons, Recharts, Socket.IO client, Playwright, and Vitest. The package already contains the required UI/animation/data libraries, so do not add another UI framework just for the redesign unless a concrete requirement cannot be met with the existing stack.

## Golden Rule

**Screenshot = visual source of truth. Existing code = behavioral source of truth.**

If the screenshot says how something should look, reproduce that composition. If FocusMaster already has working behavior behind it, preserve that behavior and connect the redesigned component to it.

## Recommended Migration Strategy

### Step 1 — Branch and baseline

```bash
git checkout main
git pull

git checkout -b feat/deepstudy-redesign
```

Run the current app first and record baseline behavior.

### Step 2 — Inventory before editing

Search the codebase for existing implementations of:

- Layout
- Dashboard
- PomodoroTimer
- GlobalTimer
- TaskManager
- Analytics
- ClockInOut
- SpotifyPanel
- Calendar
- StudyPage
- FocusRoomsPage
- FocusRoomPage
- LeaderboardPage
- Profile
- EditProfilePage
- Settings
- AuthContext
- ThemeContext
- DeviceContext
- Zustand stores
- API services

Do not delete existing components before proving that the replacement covers their behavior.

### Step 3 — Build the visual foundation

Create a small DeepStudy visual system in the existing CSS/Tailwind architecture.

Use tokens for:

- background: near-black
- surface: black / near-black
- primary text: white / off-white
- secondary text: muted gray
- border: low-opacity neutral
- focus accent: restrained green
- destructive state: restrained neutral/red only where necessary

Do not use gradients.

### Step 4 — Create the shell

Build the new focus canvas first. It is the most important reference and everything else opens from it.

Suggested hierarchy:

```text
DeepStudyShell
└── FocusCanvas
    ├── BackgroundScene
    ├── TopUtilityBar
    ├── TagSelector
    ├── FocusTimer
    ├── CurrentTask
    ├── PrimaryActions
    ├── LeftUtilityDock
    ├── RightUtilityDock
    └── OverlayLayer
        ├── TimerModeModal
        ├── ScenePicker
        ├── MediaCard
        ├── FriendsModal
        ├── ActivitySummaryModal
        ├── LeaderboardModal
        ├── AccountMenu
        └── ProfileSidePanel
```

### Step 5 — Convert old navigation into focused overlays

Do not force every existing route to remain visible as a traditional sidebar/dashboard. Where the screenshot uses an overlay, open the existing feature inside the overlay.

The route can remain for deep linking and compatibility while the primary UI uses modal/side-panel presentation.

### Step 6 — Preserve data boundaries

Do not move API calls into every new visual component. Keep API/service calls and server state in existing services/hooks/query layers.

Visual components receive data and callbacks.

### Step 7 — Implement screenshot sections one by one

Recommended order:

1. Main focus canvas
2. Timer/stopwatch modal
3. Scene picker
4. Media/Spotify card
5. Friends modal
6. Activities summary
7. Review sessions
8. Leaderboard
9. Profile side panel
10. Account menu
11. Tasks
12. Rooms
13. Study/AI
14. Settings
15. Responsive/mobile polish

### Step 8 — Test behavior after every visual migration

After replacing a UI component, verify its original behavior before continuing.

## Technical Constraints

### Do not change stack unnecessarily

The existing frontend package already includes the relevant technologies and libraries. Prefer:

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Zustand
- TanStack React Query
- React Router
- Radix primitives
- Lucide React
- Framer Motion
- Recharts
- Axios
- Socket.IO client
- Vitest
- Playwright

Use existing dependencies first.

### When adding a dependency

Only add one if:

1. The existing stack cannot provide the needed behavior cleanly.
2. The new dependency is materially better than a small local implementation.
3. It does not duplicate an existing library.

Document the reason in the PR/commit.

## Visual Implementation Rules

### Backgrounds

Use real photographic focus scenes. Preserve their composition and negative space.

Do not use:

- CSS gradients
- gradient overlays
- animated color gradients
- gradient text

A solid translucent black overlay is acceptable for legibility.

### Modals

All screenshot-matching modals should:

- have near-black surfaces
- have rounded corners
- sit over a dimmed/blurred workspace
- keep the underlying scene visible
- use restrained borders
- have a clear close control
- prevent background scroll while open
- support Escape
- trap focus

### Buttons

Primary actions should use a light/white surface with dark text when matching the screenshot. Secondary actions should use dark/transparent surfaces with light text.

Do not introduce large colorful CTA treatments.

### Icons

Use Lucide React or the existing icon system. Keep icon stroke weight and visual scale consistent.

### Typography

Use a clean sans-serif hierarchy. Do not introduce decorative display typography that changes the character of the supplied references.

## Main Focus Screen Implementation

The main screen should not resemble the current dashboard.

The viewport should be mostly the focus scene with the timer centered.

Pseudo-structure:

```tsx
<DeepStudyShell>
  <FocusCanvas scene={scene}>
    <TopUtilityBar />
    <main className="focus-center">
      <TagSelector />
      <FocusTimer />
      <CurrentTask />
      <PrimaryFocusActions />
    </main>
    <LeftUtilityDock />
    <RightUtilityDock />
  </FocusCanvas>
</DeepStudyShell>
```

Avoid a permanent sidebar on the primary focus screen if the reference does not show one.

## Overlay State

Prefer one centralized UI overlay controller instead of many unrelated booleans.

Example concept:

```ts
type DeepStudyOverlay =
  | { type: 'timer'; mode: 'focus' | 'stopwatch' }
  | { type: 'scenes' }
  | { type: 'friends' }
  | { type: 'activity' }
  | { type: 'leaderboard' }
  | { type: 'account' }
  | { type: 'profile' }
  | { type: 'media' }
  | null;
```

Use the existing Zustand/store architecture if it already has an equivalent mechanism.

## Timer Migration

Do not duplicate timer calculations in the new UI.

The new `FocusTimer` should consume the existing timer/session state and dispatch existing actions.

The redesign must not reintroduce the current known issue where reload returns the timer to the default 25 minutes. Investigate persistence before marking the timer migration complete.

Also verify:

- pause/resume
- reset
- completion
- session creation
- tag association
- task association
- sound
- stopwatch
- extension/deep-focus state

## Analytics Migration

Use existing analytics endpoints and calculation logic.

The new visual layer should map existing data into:

```text
Activities summary
├── Analytics
│   ├── Today / This week / This month
│   ├── Total Sessions
│   ├── Focused Time
│   ├── Best Sessions
│   ├── Tasks completed
│   ├── Focus Score
│   └── Activity chart
└── Review Sessions
    ├── Date navigation
    ├── Tag filter
    └── Session timeline
        ├── duration
        ├── tag
        ├── edit
        ├── note
        └── delete
```

## Scene Migration

Scene selection should update the same persisted background/scene state used by the existing application.

Do not hard-code screenshot filenames into application logic if a scene configuration already exists.

Create a normalized scene model only if necessary:

```ts
interface FocusScene {
  id: string;
  name: string;
  category: 'motion' | 'still' | 'weather' | 'personal';
  src: string;
  preview?: string;
}
```

## Profile Migration

Keep the current profile API and validation. The side panel is presentation only.

Fields:

- name
- about
- room handle
- chat during Pomodoro
- room lock
- discoverability

Do not duplicate profile persistence in local storage.

## Leaderboard Migration

Keep existing leaderboard data and ranking calculations. Only redesign the rendering layer.

The UI must support:

- global/friends
- daily/weekly/monthly
- date navigation
- rank
- user
- focus duration
- rewards/trend information when available

## Friends Migration

Keep current friendship APIs. Build the screenshot-matching empty and populated states around the existing data.

## Spotify Migration

Reuse the existing Spotify controller/API integration. The new media card is only a new presentation layer.

Do not add a second Spotify authorization flow.

## Tasks Migration

The current maintenance notes identify a date-update issue in the Kanban board. Fix it while migrating the UI, but do not mix unrelated task-system refactors into the redesign unless required.

## Existing Maintenance Issues

Carry forward these known items from the existing project:

- timer reload resets to 25 minutes
- general state/settings reset after reload
- slow application performance
- Spotify synchronization/control behavior
- 10-second warning beep
- timer-end beep
- Kanban date update issue

These should be tracked separately from pure visual work.

## Responsive Rules

The desktop screenshot composition is the highest-fidelity target.

Do not simply shrink the desktop UI.

At smaller widths:

- reduce timer scale
- collapse top utilities
- convert bottom docks to scrollable controls/bottom sheet
- adapt scene grid
- make modals nearly full-width
- keep primary Start action easy to reach

## Performance Rules

- Never render all heavy overlays at once if avoidable.
- Lazy-load expensive feature content.
- Keep timer state updates localized.
- Avoid recreating background image objects every render.
- Optimize scene assets.
- Avoid unnecessary React Query refetches when opening/closing overlays.

## QA Method

For each supplied screenshot:

1. Implement the structure.
2. Run the app at the same approximate viewport.
3. Compare proportions.
4. Compare position.
5. Compare typography.
6. Compare opacity.
7. Compare spacing.
8. Compare icon size.
9. Compare borders/radii.
10. Check for accidental gradients or colors.
11. Check keyboard/focus behavior.
12. Check the underlying feature behavior.

Do not declare a section complete because it is merely functional. It must also match the reference composition.

## Coding Prompt

Use the following prompt when giving this project to a coding agent:

> You are implementing the DeepStudy redesign inside the existing FocusMaster codebase. Do not rebuild the application from scratch. First inspect the repository and identify the existing components, stores, contexts, hooks, API services, backend endpoints, and tests for every feature you touch. Reuse existing behavior and data contracts wherever possible.
>
> The supplied DeepStudy screenshots are the visual source of truth. Reproduce their layout, spacing, hierarchy, modal sizes, side panels, controls, typography, icon placement, dark surfaces, photographic backgrounds, and interaction pattern as closely as possible. Do not invent a different design.
>
> Non-negotiable: **no gradients anywhere**. Do not add CSS gradients, gradient text, gradient buttons, gradient borders, or gradient overlays. Use solid/translucent near-black surfaces, white/off-white text, muted secondary text, restrained green focus accents, and photographic backgrounds consistent with the references.
>
> Preserve all existing FocusMaster functionality: authentication, timer/stopwatch, sessions, tasks, analytics, review sessions, friends, focus rooms, leaderboard, profile, settings, Spotify, calendar, study/AI, extension-related behavior, and admin functionality. Change presentation first; change backend contracts only when absolutely necessary and document any such change.
>
> Build the redesign incrementally. Start with the full-screen DeepStudy focus canvas, then implement the timer/stopwatch modal, scene picker, media card, friends modal, activity summary, review sessions, leaderboard, profile side panel, and account menu. Then migrate tasks, rooms, study/AI, and settings to the same design language.
>
> Keep the current technology stack unless a real technical limitation is found. Prefer React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, TanStack Query, React Router, Radix, Lucide, Framer Motion, Recharts, Axios, Socket.IO, Vitest, and Playwright already present in the project.
>
> Before changing code, map each reference screenshot to the existing implementation. For each redesigned component, identify which existing logic it replaces visually and which existing services/stores it must continue to call. Do not create duplicate API calls, duplicate state models, duplicate authentication, or duplicate timer logic.
>
> Use reusable components such as `DeepStudyShell`, `FocusCanvas`, `TopUtilityBar`, `FocusTimer`, `TagSelector`, `UtilityDock`, `ModalShell`, `SidePanel`, `ScenePicker`, `FriendsModal`, `ActivitySummaryModal`, `LeaderboardModal`, `AccountMenu`, and `ProfilePanel` where appropriate. Keep business logic out of purely presentational components.
>
> Validate the result after every feature. Run TypeScript/build/lint/tests and Playwright after the major migration steps. Check desktop and mobile behavior. Verify that timer state and user settings persist after reload. Verify that existing API behavior has not regressed.
>
> Do not remove an existing feature just because it is not shown in a screenshot. If a feature is not represented by a reference image, keep it available and redesign it consistently with the same visual system.
>
> When uncertain, prefer: screenshot fidelity for visual decisions, existing FocusMaster behavior for business logic, minimal architectural change, and zero gradients.
