# DeepStudy — UI/UX Redesign Specification

## 1. Project Direction

DeepStudy is a visual and product redesign of the existing FocusMaster application. The existing FocusMaster codebase, backend, authentication, APIs, data models, integrations, timers, analytics, rooms, leaderboard, tasks, profile, and testing infrastructure should be reused wherever practical.

The objective is not to rebuild the product from scratch. Preserve working behavior and redesign the user experience around the supplied DeepStudy reference screenshots.

The screenshots are the primary visual source of truth for visual decisions.

## 2. Non-Negotiable Visual Rules

- No gradients anywhere in the product.
- Never introduce gradient backgrounds, buttons, borders, or text.
- Do not invent a different visual language from the references.
- Use a dark, warm, cinematic workspace aesthetic with large photographic focus backgrounds.
- The active workspace should feel like a calm study room, not a conventional dashboard.
- Use restrained black/near-black surfaces for overlays and panels.
- Use white/off-white typography and muted secondary text.
- Use green only as a restrained focus/status accent.
- Use rounded controls and panels consistent with the references.
- Avoid excessive cards, dense dashboard grids, bright decorative colors, heavy shadows, or effects stronger than the references.
- Motion should be subtle and purposeful.

## 3. Product Experience Principles

### Focus-first canvas
The timer and current task are the visual center of gravity.

### Controls are peripheral
Secondary functionality belongs at the edges, in popovers, sheets, side panels, or centered modal surfaces.

### Progressive disclosure
Do not show analytics, friends, leaderboard, scenes, Spotify, settings, and account controls simultaneously. Open them when requested.

### Preserve continuity
Timer state, selected duration, current task, tag, scene, room state, music state, and user settings should persist wherever the existing architecture supports it.

## 4. Information Architecture

Keep the current FocusMaster capability set available:

- Focus Home / main timer
- Tasks
- Pomodoro / focus timer
- Focus Rooms
- Leaderboard
- Analytics / activity summary
- Clock / time tracking
- Spotify
- Calendar
- Study / AI features
- Settings
- Profile

Presentation and interaction patterns may change without unnecessarily changing routes or APIs.

## 5. Main Focus Workspace

Reference: supplied main workspace screenshot.

### Layout

- Full viewport focus-scene background.
- Use photographic composition with negative space behind the timer.
- Add a solid/translucent dark legibility layer when needed; do not use gradients.
- Top-left: DeepStudy logo/mark and product name.
- Beside brand: compact mode pill such as `Deep Focus`.
- Top-right: compact utility cluster for streak, focus/elapsed time, analytics/activity, and profile.
- Center-upper: `Select a tag` selector.
- Center: very large `HH:MM` timer.
- Below timer: editable work label such as `What are you working on?`.
- Below label: timer/stopwatch control, large `Start` button, and secondary action.
- Bottom-left: weather, sound/music, background/scene controls.
- Bottom-right: friends, chat, focus mode, and activity/history controls.

### Interaction

- `Start` is the dominant action.
- Timer remains visually stable while secondary UI opens.
- Tag remains readable but visually quiet.
- Task text connects to existing task/session behavior.
- Reuse existing timer logic rather than rewriting timer behavior for presentation.

## 6. Timer / Stopwatch Overlay

Reference: compact centered black modal with `Focus Timer` and `Stopwatch` tabs.

### Redesign

- Center a compact near-black modal over a blurred/dimmed workspace.
- Rounded corners and restrained borders.
- Two mode tabs in the header row.
- Active tab gets the stronger filled surface; inactive tab stays subdued.
- Close button at top-right.
- Stopwatch view explains open-ended timing with a short description.
- Keep the `Deep Focus` extension-related option where existing behavior supports it.
- Keep Chrome extension requirement visible when relevant.

### Behavior

- Reuse existing timer/stopwatch state and session recording logic.
- Switching modes should not unnecessarily reset unrelated workspace state.
- Support keyboard start/pause/reset and Escape-to-close.

## 7. Spotify / Media Panel

Reference: lower-left compact music/video card.

### Redesign

- Anchor the media card to the lower-left utility area.
- Include provider name, change action, artwork/embed preview, playback control, and optional synchronization control.
- Do not permanently consume central workspace space.
- Reuse existing Spotify integration and synchronization logic.
- Provide a clear disconnected state.

### Future compatibility

A media-provider abstraction can support Spotify and YouTube later without rewriting the focus canvas.

## 8. Focus Scene / Background Selector

Reference: large centered `Set your focus scene` modal.

### Redesign

- Large centered black modal with generous spacing.
- Header: `Set your focus scene` and close button.
- Top controls: visibility/intensity control and `Background` / `Weather` tabs.
- Secondary categories: `Motion`, `Stills`, `Personalize`.
- Responsive two-column scene image grid on desktop.
- Preserve scene image aspect ratios from the references.
- Selected scene needs a clear but restrained active state.
- Scene list scrolls internally while the main page stays fixed.

### Feature extension

`Personalize` can support uploaded/user-created scenes later without changing the overall visual structure.

## 9. Focus Friends Modal

Reference: large centered `Focus friends` modal.

### Redesign

- Centered large modal over dimmed/blurred workspace.
- Header: title, email/friend-code input, close button.
- Tabs: `Friends activity` and `Manage requests`.
- Intentional empty state centered in the body.
- Primary actions: `Copy` and `Share`.
- Friend rows emphasize focus state and time without visual noise.

### Behavior

Reuse current friendship, room, and backend relationships. Do not create a parallel social model only for UI.

## 10. Activities Summary / Analytics Modal

Reference: supplied analytics and review-session screenshots.

### Analytics tab

- Large centered modal.
- Header title: `Activities summary`.
- Tabs: `Analytics` and `Review Sessions`.
- Period tabs: `Today`, `This week`, `This month`.
- Summary metrics:
  - Total Sessions
  - Focused Time
  - Best Sessions
  - Tasks completed
  - Focus Score
- Time-of-day activity chart below metrics.
- Minimal dark chart styling.
- Use green only for primary focus activity data.
- Show the Digital Habits / Chrome extension onboarding state when data is unavailable.

### Review Sessions tab

- Date navigation.
- Tag filter.
- Vertical session timeline/list.
- Each row: time, duration, tag, edit action, note, delete action.
- Inline note editing.

### Behavior

Reuse existing analytics/session APIs and calculations. Do not change calculations just to match the new UI.

## 11. Leaderboard Modal

Reference: `Global / Friends`, `Daily / Weekly / Monthly`, date navigation, ranked users, focus times, reward icons.

### Redesign

- Large centered near-black modal.
- `Global` / `Friends` switch at top-left.
- `Daily` / `Weekly` / `Monthly` selector at top-right.
- Date navigation centered below controls.
- Rows include rank, avatar/flag, user, focus time, reward/action.
- Preserve short bios and trend indicators where returned by the existing backend.
- Give the top performer stronger hierarchy without gradients or excessive decoration.

### Behavior

Reuse existing leaderboard API and ranking calculations. Cover loading, empty, error, and pagination/virtualization states where appropriate.

## 12. Profile Side Panel

Reference: right-side profile editing panel.

### Redesign

- Slide in from the right.
- Header contains profile name, home/breadcrumb affordance, share action, and optional utility icon.
- Fields: Name, About, Room handle.
- Toggles:
  - Enable chat during Pomodoro
  - Lock room
  - Discoverable
- Persistent `Save` action near the bottom.
- Keep the workspace visible behind the panel in a subdued state.

### Behavior

Reuse profile APIs and validation, including unique room-handle validation.

## 13. Account Menu

Reference: compact account dropdown from the avatar control.

### Redesign

- Compact dark dropdown aligned to the top-right account control.
- Header shows the complete user name and dismiss action.
- Preserve the existing capability list:
  - Upgrade
  - Public profile
  - Find study room
  - App settings
  - Manage friends
  - Discord/community link
  - Chrome extension
  - Notion Pomodoro timer
  - Our apps
  - Logout
- Keep external-link indicators where relevant.
- Use separators to group account, settings, community, and external items.

## 14. Tasks / Kanban

The references do not directly show the task manager. Make it a companion to the focus canvas rather than a disconnected enterprise dashboard.

### Requirements

- Preserve existing Kanban behavior, tags, priorities, completion state, and date logic.
- Use the same dark visual system.
- Prioritize quick task capture and quick status changes.
- Keep due date and current focus task easy to access.
- Feed completed work into activity analytics without duplicate state.

## 15. Focus Rooms

- Use the same room-oriented visual language as the focus canvas.
- Discoverable rooms can be compact cards/list rows.
- Joining a room should transition into a focused room environment, not a generic dashboard.
- Preserve room lock, discoverability, chat, membership, and timer synchronization behavior.

## 16. AI / Study Features

The current application already contains AI/study functionality. DeepStudy should preserve its backend capability while presenting it in the new visual language.

### UX direction

- AI actions open in focused panels rather than dominating the home canvas.
- Keep study planning, note assistance, and AI insights accessible from the study area or a compact AI control.
- AI surfaces use the same near-black, muted visual system and never use gradients.

## 17. Settings

- Use nested panels or a right-side/centered overlay pattern instead of a dense admin-style dashboard.
- Group settings into appearance, timer, sounds/notifications, integrations, privacy, and account.
- Reuse the same compact controls and toggles as the profile panel.

## 18. Responsive Design

### Desktop
Treat the supplied screenshots as the primary desktop composition and match them closely.

### Tablet
- Reduce timer size proportionally.
- Allow bottom utilities to wrap/scroll when necessary.
- Preserve modal readability.

### Mobile
- Preserve focus canvas and timer hierarchy.
- Move top-right utilities into a compact menu.
- Make scene grid responsive.
- Bottom utilities may become a horizontal dock or bottom sheet.

## 19. Accessibility

- Accessible labels for every icon-only button.
- Modal focus trapping and Escape close.
- Keyboard timer controls.
- Adequate contrast against photos.
- Do not communicate state by color alone.
- Semantic form labels/headings.

## 20. Performance

- Preserve existing route/code splitting.
- Lazy-load expensive panels and scene assets.
- Optimize background images and use appropriate source sizes.
- Do not mount analytics/leaderboard/scene-heavy components until opened.
- Isolate timer updates to avoid whole-screen re-renders.

## 21. Suggested Component Architecture

```text
DeepStudyShell
FocusCanvas
TopUtilityBar
FocusTimer
FocusTaskLabel
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

AnalyticsSummary
SessionTimeline
TaskBoard
FocusRoomList
StudyPanel
SettingsPanel
```

Use existing feature/service/store boundaries. Keep business logic out of presentation-only components.

## 22. State Management

Continue using the existing query/state architecture unless a concrete limitation requires change.

Local UI state:
- active modal
- active side panel
- selected tab
- selected scene
- local visual intensity/volume
- account menu open state
- unsaved profile draft

Server state:
- sessions
- analytics
- friends
- room membership
- leaderboard
- tasks
- profile
- AI data
- Spotify connection

## 23. Existing Code Reuse Policy

Before adding functionality:

1. Find the existing component, service, store, or API implementation.
2. Confirm whether it already exposes the needed behavior.
3. Reuse the behavior and change presentation wherever possible.
4. Add abstractions only when the current architecture cannot support the desired interaction cleanly.
5. Avoid duplicated API calls, state models, and parallel implementations.

## 24. Definition of Done

- Main focus screen follows the supplied reference composition.
- Timer/stopwatch modal follows the supplied structure.
- Media panel follows the supplied interaction.
- Scene selector follows the supplied modal/grid structure.
- Friends modal follows the supplied structure.
- Activities summary and review sessions follow the supplied structures.
- Leaderboard follows the supplied structure.
- Profile side panel and account menu follow the supplied structures.
- Existing functionality remains operational.
- No gradients exist anywhere in the product.
- No major existing capability is silently removed.
- API contracts remain stable unless a documented reason requires change.
- Tests/E2E coverage are updated for redesigned interactions.

## 25. Reference Fidelity Rule

When a screenshot and an implementation preference conflict, the screenshot wins for visual decisions. Existing product logic wins for behavior unless the redesign explicitly specifies a behavior change.
