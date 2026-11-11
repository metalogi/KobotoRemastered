# 07 — High-level plan

Goals: Unity 6, bugs fixed, all 60 levels restored to original playability, modern code and project structure, assets that look right on current iOS hardware.

Revised 2026-11-10 for: 60 levels confirmed, the Unity 4 project folder being available, and Maya not being available.

## Approach in one paragraph

Keep the C# remaster — its design is sound and it already plays ten levels — and treat the original as a data, art and behaviour source, not as code to revive. First make the repo whole: recover the assets it never had from the Unity 4 folder, and get the original running in its own editor as the reference. Then move the engine while the project is small, and make the existing ten levels a properly shippable slice on a real device. Only then restructure the code, so every level ported afterwards lands on the final architecture exactly once. Restore the remaining 50 levels through a repeatable conversion pipeline rather than by hand, adding missing mechanics in order of how many levels need them. Do the rendering and art uplift on shared materials, shaders and UI so it applies to all levels at once.

```
Phase 0  Baseline & recovery ──► Phase 1  Unity 6 ──► Phase 2  Shippable slice ──► Phase 3  Modernise ──┬─► Phase 4  Rendering ──┬─► Phase 6  Art & UI ──► Phase 7  Release
                                                                                                        └─► Phase 5  Levels ─────┘
```

## Decisions

| # | Decision | Status |
|---|---|---|
| D1 | Level scope | **Resolved: all 60.** 10 ported, 50 to go. Order is the Unity 4 build order (doc 04) |
| D2 | Reference for "original playability" | **Resolved 2026-11-11: Unity 5.6.** Unity 4.2 cannot be activated any more (Unity's server fails the request). A copy of the original project runs in Unity 5.6.7f1 with the original scripts and settings; 33 Maya models are swapped for FBX versions. Caveat: 5.6 uses a newer physics engine (PhysX 3.3) than 4.2 (PhysX 2.8), so handling is close to, not identical to, the shipped game. See doc 03 |
| D3 | Source art | **Resolved.** Maya sources exist for models; there are no higher-resolution 2D sources or music masters. 2D art is upscale-or-redraw |
| D4 | Render pipeline: stay on Built-in or move to URP | Open. Suggested: URP, as its own phase after the engine upgrade |
| D5 | Front-end scope | Open. Suggested: restore world select and tutorials; drop social links. The trophy room was not in the shipped build list, so leave it out |
| D6 | Mac with Xcode (or a cloud Mac build service) and Apple developer account | Open. Needed before Phase 2 |
| D7 | Controls: tilt only, or tilt plus a touch alternative | Open. Suggested: tilt default, touch alternative in settings |
| D8 | Minimum device / iOS version | Open. Suggested: whatever the chosen Unity 6 release requires, tested on the oldest phone you own |
| D9 | **Physics target: original feel or the remaster's?** The remaster uses gravity −15 at 100 Hz; the original is equivalent to −9.08 at 25 Hz | Open. Decide after playing the original and the remaster side by side in Phase 0. Everything tuned later depends on it |
| D10 | Maya | **Resolved: not available.** The 13 models with no FBX are recovered by extraction from the old build data (Phase 0); exporting from the Unity 4 editor is no longer possible |

## Phase 0 — Baseline and asset recovery

Purpose: make the repo complete and make every later change comparable against a known state.

Housekeeping:

- Done 2026-11-10: branch fast-forwarded to `3e109e3`; `.gitignore`, `Docs/` and the editor's `.meta` clean-up committed as `727115f`, tagged `baseline-2019.1`, and pushed.
- Consider Git LFS before adding more binaries.
- Add `level08`, `Level09`, `Level10` to the build scene list.

Get the original running:

- Done 2026-11-11: the original runs in Unity 5.6.7f1 from the working copy `/Original/KobotoU4_unity56` (doc 03, "Reference build"). Unity 4.2 was tried first and cannot be activated.
- Play and screen-record all 60 levels in that copy. These recordings define "original playability" for Phase 5. Note per level anything that looks wrong because of the missing models or the newer physics engine, so it is not mistaken for original behaviour.
- When the 13 missing models are recovered (below), add them to the working copy too and re-record the affected levels (mostly Worlds 2 and 3).

Recover what the repo never had (all from the Unity 4 folder; details in doc 08):

1. **Small assets, copied with their `.meta` files** so existing GUID references resolve: the eight physics materials, `fireworks.js` and `Button.js` (as data shims later), the two missing music tracks, `GameplayParameters.prefab` and the GUI skins if wanted for reference. Binary `.prefab`/`.physicmaterial` files import fine; Unity rewrites them as text.
2. **Model fix for 33 models.** Two ways, both proven on the 5.6 working copy's metadata:
   - *File swap* (what `tools/swap_maya_for_fbx.py` does to the working copy): put the repo's FBX in place of the `.mb` but keep the `.mb`'s `.meta`, so the GUID and sub-asset IDs are unchanged and no scene needs editing. The script renames the main animation clip entry and marks clips Legacy.
   - *Reference remap* in the repo: rewrite `guid: <maya file>` to `guid: <matching *_fbx.fbx>` in scene and prefab YAML. The repo's FBX files already have their own GUIDs and some prefabs point at them, so this avoids two assets for one model.
   Either way, `tools/level_missing_assets.py` measures progress: its "maya" column should fall to the 13 below. Known loss: the FBX `butterfly` has only its main clip, so the per-wing clips used by World 3 butterflies are gone.
3. **The 13 models with no FBX** (`bambooA`, `hungry_caterpillar`, `w1_bgTree`, `snow1/2/3`, `snow1_lb`, `CAVE1/2/3`, `jetPakIceMonsta`, `chase_slope`, `tutorialSign1@On`). Without Maya or a working Unity 4 editor, in order of preference:
   - **Extract from the old build.** `buildTest/Data/*.assets` in the Unity 4 folder contains every imported mesh and clip. An open-source asset-extraction tool that reads Unity 4 data (for example AssetStudio) can export them as FBX or OBJ. Give each a `.meta` with the Maya file's GUID and sub-asset IDs, as the swap script does.
   - **A Maya trial or someone with Maya** to batch-export FBX is the cleanest result if it becomes possible, and worth it eventually for `hungry_caterpillar` (47 meshes, 75 clips), the one complex rig.
   - Most of the 13 are single static meshes (cave and snow floors, a tree, bamboo), so rebuilding one by hand is a tolerable last resort.

Then baseline the remaster:

- Play levels 1–10 in the 2019.1 editor after recovery. Record each, and note what is broken against the original recordings. This is the regression reference for Phase 1 and the first real test of doc 06.
- Decide D9 (physics target) from the side-by-side.

Exit: tagged baseline; original recorded for 60 levels; remaster recorded for 10; no unresolved model, physics-material or script references in the 60 level scenes.

## Phase 1 — Engine upgrade to Unity 6

Purpose: get the existing game compiling and behaving the same on a current editor, changing as little else as possible.

Prepare, still in 2019.1:

- Delete `Assets/Original/Standard Assets/Effects` and `Standard Assets/Editor` (legacy Image Effects — unused, already producing obsolete-API warnings, and unlikely to compile on a current editor). Keep the restored `Physic Materials` folder.
- Delete or park `Assets/Original/Editor` (`ObjExporter.cs` and friends use removed editor APIs; the `.js` tools are dead).
- Strip `Packages/manifest.json` to the modules actually used; remove ads, analytics, purchasing, collab, HLAPI, package-manager-ui, XR legacy input.
- Leave the `.js` files and their `.meta` files in place for now. They are inert, and their GUIDs are needed in Phase 5.

Upgrade in hops, opening the project, letting the API updater run, fixing errors, play-testing and committing at each stop:

1. **2019.4 LTS** — picks up the uGUI-as-package migration, Asset Database v2 and the PhysX 4.1 change in isolation. This is the hop most likely to change physics feel; compare against the Phase 0 recordings here.
2. **2022.3 LTS** — bulk of API deprecations with good auto-upgrade coverage.
3. **Unity 6 LTS** (the current 6000.x LTS at the time) — physics API renames (`velocity` → `linearVelocity`, `drag` → `linearDamping`, `PhysicMaterial` → `PhysicsMaterial`), which the updater handles.

A direct jump from 2019.1 to Unity 6 would probably work for a project this small with no third-party plugins. The hops cost little and make it obvious which version introduced a behaviour change.

Known code fixes to expect (already flagged obsolete in 2019.1): `LineRenderer.SetVertexCount` (`KSpline.cs`), `EditorGUILayout.EnumMaskPopup` (two custom inspectors); plus `FindObjectOfType` deprecations and the move off the legacy .NET 3.5 runtime. Stay on the **Built-in Render Pipeline** and **legacy Input Manager** in this phase so that rendering and input are not changing at the same time as the engine.

Exit: Unity 6 opens with zero compile errors; levels 1–10 play in the editor as they did at baseline (or differences are listed and accepted); shaders render as before.

Risk: physics retuning. Gravity, timestep, contact offset, the tilt PID and friction-by-script were all tuned by feel on PhysX 3.4. Budget time to retune `KobotoParameters` and the tool constants, against the target chosen in D9.

## Phase 2 — A shippable slice of ten levels

Purpose: prove the whole chain — input, progression, build, device — on the content that already exists, before investing in more content.

Fix the A-severity and player-visible B-severity items in doc 06:

- Input: enable modules outside the editor (I1); give tilt a sensitivity, dead zone, clamp, smoothing and orientation handling (I2); add a simple touch control (I3).
- Progression: last-level save crash, wrong unlock index, world indexing (P1–P4); end-of-world and end-of-game flow (P5).
- Gameplay: bonus-token lookup (G1), tool removal callback (G3), null guards (G8, G9); apply the D9 physics decision (G13).
- Scenes: build list and file-name case (R2, R3).
- Settings: lock to landscape, real company and bundle id (the original used `Qwirkii` and an id beginning `com.qwrkii.kobotonew`; reuse it only if this is to update the original App Store listing), IL2CPP/ARM64, minimum iOS version, 60 fps target.
- UI: safe-area handling and a canvas that adapts from 4:3 iPad to 19.5:9 iPhone.

Then build to a device through Xcode. Tune tilt on real hardware — this cannot be done in the editor.

Exit: levels 1–10 playable start to finish on an iPhone and an iPad from a clean install, progress saved across restarts, no exceptions in the device log.

## Phase 3 — Code and project modernisation

Purpose: put the code in the shape that the remaining 50 levels will be built on. Behaviour should not change; the Phase 2 build is the regression reference.

Project structure:

- One root for live content (for example `Assets/Kubrik/` with `Runtime`, `Editor`, `Tests`, `Art`, `Audio`, `Levels`, `Prefabs`, `UI`, `Settings`), and `Assets/Legacy/` for original content that has not been migrated yet. Art that live levels use moves out of `Original` as it is adopted, so by the end `Legacy` can be deleted.
- Assembly definitions for runtime, editor and tests; a `Kubrik` namespace.
- `.editorconfig` and a consistent style; remove dead files and the per-frame `Debug.Log` calls.

Code:

- Replace string-keyed `Resources.Load` with serialised references and small ScriptableObject catalogues (creatures, tools, music).
- Grow `GameData` into the level database: per world a theme (fog, background and ground colours, music, map scene), per level a scene reference, display name, and metadata.
- Make static event buses safe: reset on subsystem registration, unsubscribe symmetrically, or replace with instance-owned events.
- Move tool tuning constants into serialised fields or ScriptableObjects so creatures can differ.
- Set up physics layers for the collision filtering the original did in script (creature, tool, world, prop).
- Adopt the Input System package: one `Move` axis fed by the gravity sensor, keyboard, gamepad and on-screen control, with processors for dead zone and sensitivity.
- Harden saving: versioned format, write-then-rename, tolerant loading.

Tests:

- Edit-mode tests for `ProgressManager` (unlocking, last level, world rollover, save round-trip).
- A play-mode smoke test that loads every level in the database, spawns creatures and runs a few seconds without exceptions.
- An asset-integrity test: no missing scripts, meshes, materials or physics materials in any level scene. This would have caught the Maya-file gap.
- A recorded-input "can it be completed" replay per level. Recorded once on a known-good build, re-run after physics or engine changes.

Exit: same behaviour as Phase 2 on device; tests green; no dependency on `Resources` paths or scene tags for core flow.

## Phase 4 — Rendering foundation

Purpose: decide the look once, on shared assets, before sixty levels depend on it. Can run alongside Phase 5.

- Install URP; convert built-in materials with Unity's converter.
- Rewrite the 40 fixed-function shaders as a small set of Shader Graph / HLSL shaders (scenery card with fog and tint, lit flat colour, unlit, background and foreground layers, water, metal/reflection, particles) and remap materials. Fix the already-broken `MetalRef` and `TexGen` effects as part of this. Eight more shaders exist only in the Unity 4 folder (`Jetstream`, `SceneryGroundPlane`, `SceneryNoFogAlpha`, `diffusepatterned`, …); check whether any level material needs them before writing replacements.
- Per-world theme data drives fog, background and ground colour (replacing the original `SetBGColors` globals).
- Creature shadows: real-time shadows from one directional light, or a decal if the flat look reads better.
- Decide Gamma versus Linear colour space deliberately; Linear will shift every colour and needs a matching pass over materials.
- Anti-aliasing (MSAA 4×), optional light post-processing (the original reserved a `foregroundBlur` layer).
- Rigidbody interpolation on the creature and a 60 fps target so motion is smooth.

Exit: levels 1–10 look at least as good as the original recordings on device at native resolution, at 60 fps on the minimum device, with no fixed-function shaders left in use.

## Phase 5 — Level restoration (50 levels)

Purpose: bring the remaining levels across with a pipeline, not by hand.

### 5a. Recover the original data with GUID-preserving shims

Unity binds a component to its script by the GUID in the script's `.meta` file. If `Foo.js` is replaced by `Foo.cs` that keeps the same `.meta` (same GUID), declares a `MonoBehaviour` named `Foo`, and has public fields with the same names and compatible types, then every scene and prefab that had a `Foo` component deserialises its old values into the new class. No scene editing is needed.

- For each original script on the backlog in doc 04, add a data-only C# shim (fields only, no behaviour) that takes over the `.js` file's `.meta`. Include `fireworks` and `Button`, using the `.meta` files from the Unity 4 folder. Put shims in a `Kubrik.Legacy` namespace and their own assembly so they cannot clash with live class names such as `Connector` and `SpawnPoint`. They have to be ordinary runtime `MonoBehaviour`s (Unity will not attach scripts from an `Editor` folder to scene objects); delete the assembly once every level is converted so none of it ships.
- Take field names and types from the pristine `.js` in the Unity 4 folder.
- Nested data classes (`TutorialPart`, `UIEditor`'s component entries, `Juncore`'s definitions) need `[System.Serializable]` and matching field names.
- Result: all 199 original scenes and 163 prefabs open with their level data visible in the Inspector and readable from editor scripts. The existing `UpgradeLevel` tool starts working again.

### 5b. A level converter

Extend `Remastered/UpdateLevel` into an idempotent batch tool that reads a legacy scene and writes a new scene (originals are never modified):

- What `UpgradeLevel` does now: root at 0.1 scale, layer reset, connector re-mesh, `Level` component, spawn points.
- Add: creature type from `SpawnPoint.coreType`; tool list and jetpack starting count from `UIEditor.components`; `DeathZone` → `Killzone`; `EndGate` → home prefab; `BonusToken` → token with auto-assigned index; `CameraOffsetZone` / `ForbiddenZone` → level zones; `Spline` + `SplineFollow` + `platform` → `KSpline` + `LevelObjectLineAttach`; `rotateZ` → rotator; `PickUpComponent` → jetpack pickup; `Jetstream` → wind zone; physics materials carried across; music and world theme; a `LevelZoneWorld` fitted to the level bounds; tutorial steps into a new tutorial asset.
- Emit a per-level report listing every legacy component it could not convert and every unresolved asset reference. That report is the remaining manual work for the level.
- For `World01_Level03` and `reflectionTest`, whose repo copies were edited in place, check the converter's output against the original running in Unity 4.
- Run the same converter's "strip legacy components" step over the ten existing levels once their data (tutorials, tool counts) has been captured.

### 5c. Missing mechanics, in order of reach

1. **Creature variants** (Rushton, tvBunny, Fisheye, Poyo, ShoeBox): prefab, face animation (`Anibox`), per-creature parameters read from the original `Juncore` values. Needed by 48 of 60 levels.
2. **Multi-creature play**: selection switching, off-screen indicator, per-house occupancy, tool counts. 11 levels.
3. **Jetpack starting count**, **creature sounds**, **death reactions** for squashed and lost.
4. **Camera interest zones**. 30 levels.
5. **Physics props**: plane-locked rigidbodies with custom gravity and layer-based collision filtering (`RigLocker`, `PhysicsBlock`, `ArtificalGravity`, `NoWorldCollision`, …). Around 20 levels, concentrated in Worlds 2 and 3.
6. **Hazards and devices**, each small: stomper, button/switch/door/trigger, chaser, spiky roller, rolling shell, magnetic prop, scales, wind from windmills.
7. **Catapult** tool. 2 levels.
8. **One-off set pieces**: caterpillar, dominoes, falling tree, runtime connectors, speed ramp, boat/ocean, reflections.

Port each by reading the pristine `.js` for behaviour and the shimmed scene data for parameters, converting distances and speeds by the 0.1 scale and remembering the original ran at 25 Hz.

### 5d. Front end

World-select screen, world 2 and 3 maps (convert `menuSnow` and `menuMachine` the way `World1_Map` was done), tutorial overlay system, settings (tilt sensitivity, volume), fail jingle and the "dark" music track.

### 5e. Acceptance per level

Completable with the intended tools; each tool behaves as in the Unity 4 recording; tokens collectable and saved; camera zones and intro behave; reset and pause leave no stale state; tutorial steps appear; no missing references; recorded-input replay added to the test set.

Suggested milestones, each releasable to testers:

| Milestone | Levels | New mechanics it forces |
|---|---|---|
| World 1 complete | Slots 11–20 (10 levels) | Rushton and Fisheye creatures, jetpack count, two-creature play, stomper, chaser (bad cloud), door, catapult, interest zones |
| World 2 complete | 20 levels | Physics props and collision layers, scales, magnetic props, rolling shell, ice-monster chase, falling tree, snow theme, recovered cave and snow models |
| World 3 complete | 20 levels | Spiky roller, switches and buttons, caterpillar, dominoes, windmill, butterflies, bamboo, World 3 fog shaders |

Exit: all 60 levels pass acceptance on device.

## Phase 6 — Art, UI and audio uplift

Purpose: make it look intentional on a 460 ppi display. There are no higher-resolution 2D sources, so this phase is upscaling and redrawing.

- Rank textures by on-screen size at target resolution (doc 05) and fix the worst first: HUD icons, level cards, splash and logo, creature faces, tutorial images.
- Upscale painted textures 2–4× with clean-up; redraw icons, logos and UI chrome as vectors; replace flat-colour swatch textures with material colours where that is all they are.
- Rebuild HUD and menus for current aspect ratios with safe areas; move text to TextMeshPro; fill in level display names; replace or license fonts.
- Texture import settings: ASTC compression, mipmaps where appropriate, sprite atlases; convert BMPs to PNG.
- Models: check normals and smoothing on import; add bevels only where edges look harsh.
- Audio: wire the original effects through an audio service and mixer groups; sensible compression and load settings. Music stays at its current quality unless masters are found.
- New app icon (the largest original is 512²), launch screen, and store screenshots.

Exit: side-by-side with the original recordings, nothing looks soft or stretched; UI is correct on the smallest and largest supported screens.

## Phase 7 — Polish and release

- Performance pass on the minimum device (draw calls, physics cost, memory, load times); frame pacing.
- Haptics, pause on interruption, audio session behaviour, background/foreground handling.
- Full play-through QA of all 60 levels on phone and tablet; fresh-install and upgrade-install save tests.
- Licence checks from doc 05 (fonts, sound library, logos).
- App Store requirements: privacy manifest and nutrition labels (simple, since no analytics or ads remain), age rating, TestFlight beta.

## Relative effort

| Phase | Size | Main driver |
|---|---|---|
| 0 Baseline and recovery | M | Recording 60 levels; the 13 models with no FBX (the original already runs in Unity 5.6) |
| 1 Unity 6 | S–M | Physics retuning after the PhysX change |
| 2 Shippable slice | M | Device bring-up and tilt tuning; needs a Mac |
| 3 Modernise | M | Breadth of small refactors; tests |
| 4 Rendering | M | Shader rewrite and material remap |
| 5 Levels | XL | 50 levels and roughly 30 missing mechanics; creature variants and physics props are the two large items; World 3 has the most one-off set pieces |
| 6 Art and UI | L | No sources, so everything visible is upscaled or redrawn |
| 7 Release | M | QA across 60 levels and several devices |

## Main risks

| Risk | Mitigation |
|---|---|
| The Unity 5.6 reference differs from the shipped game (newer physics engine, missing models) | Treat 5.6 recordings as close, not exact; note visible model gaps per level; if an old iOS device with the shipped game turns up, prefer it for disputed levels |
| The 13 models cannot be extracted cleanly without Maya | Extraction from `buildTest/Data` first; most are single static meshes; `hungry_caterpillar` is the only complex one and affects 3 levels |
| Model swap or remap points a reference at the wrong sub-mesh | Swap or remap only where ID tables match; hand-check the 9 mismatched models; asset-integrity test; compare against the 5.6 recordings |
| Physics feel drifts across engine versions, or the target is never agreed | Decide D9 in Phase 0; isolate the PhysX hop; recorded-input completion tests |
| Scope: 50 levels and many one-off mechanics | World-by-world milestones; the per-level converter report shows the true cost of each level before committing to it |
| Per-creature handling differences turn out to matter | Compare `Juncore` values across creature prefabs early in Phase 5 using the shims |
| No Mac in the workflow | Arrange hardware or a cloud build service before Phase 2 |
| Shim field mismatches silently drop data | Validate shims by spot-checking values against the raw YAML for a few scenes |
| URP conversion changes the look | Do it on ten levels first with before/after captures; keep Built-in as the fallback until signed off |

## Suggested next steps

1. Record the 60 levels in the Unity 5.6 working copy.
2. Extract the 13 missing models from `buildTest/Data` and add them to the working copy.
3. Copy the eight physics materials into the repo and fix the 33 model references there.
4. Add the three missing levels to the build list; play all ten in 2019.1; record and compare with the original; decide D9.
5. Arrange Mac access (D6).

Done so far: commit and tag `baseline-2019.1` (2026-11-10); original running in Unity 5.6 (2026-11-11).
