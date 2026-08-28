# DeepStudy — Implementation TODO

> DeepStudy is a redesign of FocusMaster, not a greenfield rewrite. Reuse existing behavior, APIs, state, data, integrations, and tests wherever possible.

## Phase 0 — Baseline Audit

- [ ] Create a DeepStudy working branch/repository from the current FocusMaster `main` baseline.
- [ ] Run frontend and backend locally before visual changes.
- [ ] Record current working routes and feature behavior.
- [ ] Identify existing components for timer, layout, tasks, analytics, rooms, leaderboard, profile, Spotify, study/AI, and settings.
- [ ] Identify existing stores, contexts, React Query hooks, API services, and backend endpoints.
- [ ] Confirm which screenshot features already exist and which need new behavior.
- [ ] Fix/record baseline bugs before attributing them to the redesign.

## Phase 1 — Design System Foundation

- [ ] Rename visible product branding from FocusMaster to DeepStudy where appropriate.
- [ ] Establish a screenshot-driven design token layer.
- [ ] Define near-black background/surface tokens.
- [ ] Define white/off-white primary text tokens.
- [ ] Define muted secondary text tokens.
- [ ] Define restrained green focus/status token.
- [ ] Define border/opacity tokens.
- [ ] Define corner-radius scale matching references.
- [ ] Define spacing scale.
- [ ] Define typography hierarchy.
- [ ] Remove all gradients from redesigned UI.
- [ ] Audit existing global CSS for gradient usage and replace it.
- [ ] Do not introduce unrelated colors or visual effects.

## Phase 2 — New Focus Shell

- [ ] Build `DeepStudyShell`.
- [ ] Build full-viewport `FocusCanvas`.
- [ ] Add background scene rendering.
- [ ] Add solid/translucent legibility treatment without gradients.
- [ ] Build `TopUtilityBar`.
- [ ] Add DeepStudy branding.
- [ ] Add Deep Focus mode pill.
- [ ] Build top-right utility cluster.
- [ ] Build center tag selector.
- [ ] Build large timer presentation.
- [ ] Build current-task label.
- [ ] Build dominant Start button.
- [ ] Build peripheral utility docks.
- [ ] Match spacing and alignment to the supplied screenshots.

## Phase 3 — Timer / Stopwatch

- [ ] Extract/reuse existing timer logic.
- [ ] Extract/reuse existing stopwatch logic.
- [ ] Build screenshot-matching timer/stopwatch modal.
- [ ] Add Focus Timer / Stopwatch tabs.
- [ ] Add modal close behavior.
- [ ] Preserve timer state when opening/closing modal.
- [ ] Preserve selected duration after reload.
- [ ] Verify timer state persistence and identify the current reload-reset issue.
- [ ] Add/verify final countdown sound behavior.
- [ ] Add/verify 10-second warning sound behavior.
- [ ] Keep Chrome extension integration state visible where applicable.
- [ ] Add keyboard controls.

## Phase 4 — Scene Picker

- [ ] Build `ScenePicker` using the screenshot structure.
- [ ] Build Background / Weather tabs.
- [ ] Build Motion / Stills / Personalize tabs.
- [ ] Build responsive two-column image grid.
- [ ] Add internal modal scrolling.
- [ ] Add selected-scene state.
- [ ] Preserve selected scene after reload.
- [ ] Optimize scene images.
- [ ] Keep Personalize extensible for user uploads.

## Phase 5 — Media / Spotify

- [ ] Redesign Spotify as the lower-left media card.
- [ ] Reuse existing Spotify authentication/API integration.
- [ ] Reuse existing playback controls.
- [ ] Reuse synchronization logic.
- [ ] Add disconnected state.
- [ ] Add provider-change interaction.
- [ ] Verify music controls do not block focus canvas.
- [ ] Consider provider abstraction for future YouTube support.

## Phase 6 — Friends

- [ ] Build screenshot-matching `FriendsModal`.
- [ ] Add friend email/code input.
- [ ] Add Friends activity tab.
- [ ] Add Manage requests tab.
- [ ] Build empty state.
- [ ] Add Copy action.
- [ ] Add Share action.
- [ ] Reuse current friend APIs and relationships.
- [ ] Verify loading/error states.

## Phase 7 — Activities Summary

- [ ] Redesign analytics as `ActivitySummaryModal`.
- [ ] Add Analytics / Review Sessions tabs.
- [ ] Add Today / This week / This month period controls.
- [ ] Build Total Sessions metric.
- [ ] Build Focused Time metric.
- [ ] Build Best Sessions metric.
- [ ] Build Tasks completed metric.
- [ ] Build Focus Score metric.
- [ ] Build time-of-day chart.
- [ ] Match chart visual language to screenshot.
- [ ] Add Digital Habits / extension onboarding state.
- [ ] Build Review Sessions timeline.
- [ ] Add date navigation.
- [ ] Add tag filtering.
- [ ] Add session editing.
- [ ] Add inline notes.
- [ ] Add session deletion.
- [ ] Reuse existing analytics calculations.

## Phase 8 — Leaderboard

- [ ] Redesign leaderboard as a centered modal.
- [ ] Add Global / Friends switch.
- [ ] Add Daily / Weekly / Monthly switch.
- [ ] Add date navigation.
- [ ] Match ranked-row layout.
- [ ] Preserve avatar/flag/bio data.
- [ ] Preserve trend indicators.
- [ ] Preserve reward icons/actions where supported.
- [ ] Reuse leaderboard API and ranking logic.
- [ ] Handle loading/empty/error states.

## Phase 9 — Profile + Account

- [ ] Redesign profile as right-side panel.
- [ ] Add Name field.
- [ ] Add About field.
- [ ] Add Room handle field.
- [ ] Add chat-during-Pomodoro toggle.
- [ ] Add lock-room toggle.
- [ ] Add discoverable toggle.
- [ ] Add persistent Save action.
- [ ] Preserve profile validation/API behavior.
- [ ] Redesign avatar account dropdown.
- [ ] Preserve all existing account menu destinations.
- [ ] Preserve external-link indicators.

## Phase 10 — Tasks / Kanban

- [ ] Redesign Kanban to use DeepStudy visual language.
- [ ] Preserve existing task data model.
- [ ] Preserve tags.
- [ ] Preserve priorities.
- [ ] Preserve due dates.
- [ ] Preserve completion state.
- [ ] Fix/verify existing date update issue.
- [ ] Ensure focused task can be connected to a timer session.
- [ ] Ensure task completion appears in analytics.

## Phase 11 — Focus Rooms

- [ ] Redesign room discovery/list UI.
- [ ] Redesign room detail experience.
- [ ] Preserve room membership.
- [ ] Preserve room lock.
- [ ] Preserve discoverability.
- [ ] Preserve chat.
- [ ] Preserve synchronized focus state.
- [ ] Make room UI visually consistent with the focus canvas.

## Phase 12 — Study / AI

- [ ] Audit existing Study/AI routes and components.
- [ ] Preserve current AI backend APIs.
- [ ] Redesign AI entry point to fit the focus canvas.
- [ ] Redesign study planner surface.
- [ ] Redesign notes/RAG surface if present.
- [ ] Redesign AI insights surface.
- [ ] Keep AI panels focused and non-distracting.
- [ ] No gradients in AI UI.

## Phase 13 — Settings

- [ ] Redesign settings using the same side-panel/modal language.
- [ ] Group appearance settings.
- [ ] Group timer settings.
- [ ] Group sound/notification settings.
- [ ] Group integration settings.
- [ ] Group privacy settings.
- [ ] Group account settings.
- [ ] Preserve existing setting persistence.

## Phase 14 — Responsive + Accessibility

- [ ] Test 1440px desktop.
- [ ] Test 1280px desktop.
- [ ] Test 1024px tablet.
- [ ] Test 768px tablet.
- [ ] Test 430px mobile.
- [ ] Test 390px mobile.
- [ ] Add accessible labels to icon-only buttons.
- [ ] Add focus trapping to modals.
- [ ] Add Escape-to-close behavior.
- [ ] Verify keyboard timer controls.
- [ ] Verify contrast against all reference scenes.
- [ ] Ensure state is not communicated by color alone.

## Phase 15 — Performance

- [ ] Keep route-level lazy loading.
- [ ] Lazy-load heavy scene assets.
- [ ] Lazy-load analytics and leaderboard content.
- [ ] Avoid expensive hidden modal mounts.
- [ ] Isolate timer re-renders.
- [ ] Optimize image sizes and formats.
- [ ] Verify no unnecessary API refetches when opening overlays.

## Phase 16 — Testing

- [ ] Update unit tests for redesigned components.
- [ ] Update integration tests for timer/session flows.
- [ ] Update analytics tests.
- [ ] Update task tests.
- [ ] Update friends/room tests.
- [ ] Update leaderboard tests.
- [ ] Update profile tests.
- [ ] Update Spotify tests.
- [ ] Update E2E selectors after UI redesign.
- [ ] Add E2E test: open focus screen.
- [ ] Add E2E test: start/pause/finish session.
- [ ] Add E2E test: change scene.
- [ ] Add E2E test: open analytics.
- [ ] Add E2E test: review/edit/delete session.
- [ ] Add E2E test: open leaderboard.
- [ ] Add E2E test: edit profile.
- [ ] Add E2E test: open account menu.
- [ ] Run lint, typecheck, unit tests, and Playwright.

## Phase 17 — Product Cleanup

- [ ] Remove obsolete FocusMaster visual components only after replacement is verified.
- [ ] Remove duplicated state/API logic introduced during redesign.
- [ ] Remove unused CSS/classes.
- [ ] Remove unused dependencies only after checking all feature usage.
- [ ] Update visible copy to DeepStudy.
- [ ] Update page titles/meta where appropriate.
- [ ] Update favicon/logo assets.
- [ ] Update README/documentation.
- [ ] Update attribution/legal text where necessary.

## Phase 18 — Screenshot QA

For every supplied reference screenshot:

- [ ] Compare layout proportions.
- [ ] Compare modal width/height.
- [ ] Compare alignment.
- [ ] Compare typography hierarchy.
- [ ] Compare button dimensions.
- [ ] Compare spacing.
- [ ] Compare icon placement.
- [ ] Compare overlay opacity.
- [ ] Compare border treatment.
- [ ] Compare background treatment.
- [ ] Verify there are no gradients.
- [ ] Verify no unrequested UI has appeared.

## Existing Known Issues to Carry Forward

From the current FocusMaster maintenance notes:

- [ ] Fix timer reload returning to default 25 minutes.
- [ ] Fix persisted settings/state reverting to defaults after reload.
- [ ] Investigate slow project performance.
- [ ] Verify Spotify connection/control/sync behavior.
- [ ] Add 10-second timer warning beep.
- [ ] Add timer-end beep.
- [ ] Verify date updates in Kanban.

These are existing product concerns and should not be hidden by the redesign.

## Final Release Checklist

- [ ] DeepStudy branding complete.
- [ ] All supplied screenshots implemented as the visual source of truth.
- [ ] Existing FocusMaster functionality preserved.
- [ ] No gradients anywhere.
- [ ] No major feature silently removed.
- [ ] API contracts verified.
- [ ] State persistence verified.
- [ ] Desktop responsive QA complete.
- [ ] Mobile responsive QA complete.
- [ ] Accessibility QA complete.
- [ ] Performance QA complete.
- [ ] Unit tests pass.
- [ ] E2E tests pass.
- [ ] Production build passes.
- [ ] Documentation updated.
