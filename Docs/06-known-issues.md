# 06 — Known issues

Found by reading code, scene data, the 2019.1 editor log and the Unity 4 project folder. Items marked **(log)** are confirmed by the editor log; the rest are from code reading and have **not been reproduced at runtime**. Line numbers are for `3e109e3`; no code has changed since. Paths are under `Assets/Remastered/Scripts/` unless they start with another folder.

Severity: **A** blocks a playable device build or loses progress; **B** wrong behaviour a player would notice; **C** latent, cosmetic or hygiene.

## Repository and configuration

| # | Sev | Issue |
|---|---|---|
| R1 | — | **Resolved 2026-11-10.** The branch was one commit behind `master`; it has been fast-forwarded to `3e109e3`. |
| R2 | A | Build settings list only `Splash`, `Main`, `World1_Map`, `Level01–05`, `Level07`, `Level06`. `level08`, `Level09`, `Level10` are missing, but `GameData.asset` marks them live and `AppController.LoadLevel` loads by path, which only works for scenes in the build list. Expected result: finishing level 7 and pressing "next" fails to load. |
| R3 | B | `Scenes/World1/level08.unity` is lower-case; `GameData` refers to `World1/Level08`. Harmless on Windows, a risk on case-sensitive file systems and in path lookups. |
| R4 | B | Player settings are placeholders: company `DefaultCompany`, bundle id `com.Company.ProductName`, minimum iOS 7.0, scripting backend unset, legacy .NET 3.5 runtime. |
| R5 | B | All four autorotation orientations are enabled. Tilt control reads one gravity axis and assumes a fixed landscape orientation. |
| R6 | C | `.gitignore` **resolved** — added and committed 2026-11-10 in the `baseline-2019.1` commit. Still open: no Git LFS for binaries. |
| R7 | C | Seven obsolete packages in `manifest.json` (ads, analytics, purchasing, collab, UNet HLAPI, package-manager-ui, XR legacy input). |
| R8 | C | `GameData.asset` has placeholder "Snow" and "Jungle" worlds (not live) whose levels reuse World 1 UIDs (`w1l1`…) and scene paths. |

## Input

| # | Sev | Issue |
|---|---|---|
| I1 | A | `PlayerInput/InputManager.cs:51–54` enables the keyboard and tilt modules only inside `#if UNITY_EDITOR`. In a player build every module stays disabled, so the creature cannot be controlled. |
| I2 | B | `InputModuleTilt` returns raw `Input.gyro.gravity.x`: no sensitivity, dead zone, clamp, smoothing or calibration, and no handling of which landscape orientation the device is in. The original exposed `TiltSensitivityMultiplier`, `TiltClampValue` and a user sensitivity slider. (The `master` commit is titled "tilt changes" but refers to the creature's visual tilt; the input module is unchanged.) |
| I3 | C | `InputModuleSwipe` is an empty class. There is no touch fallback for players who cannot or do not want to tilt, and none for simulator testing. |
| I4 | C | Input uses the legacy `UnityEngine.Input` API throughout (`gyro`, `GetKey`, `GetMouseButtonUp`). |

## Progression and scene flow

| # | Sev | Issue |
|---|---|---|
| P1 | A | `App/ProgressManager.cs:156` — `MarkCurrentLevelComplete` always reads `gameProgress[world][currentLevelIndex + 1]`. On the last level of a world this is out of range and throws before `SaveToFile()`, so completing the final level is never saved. |
| P2 | B | `ProgressManager.cs:149` — on finishing a world it unlocks index `[1]` (the second level) of the next world instead of `[0]`. |
| P3 | B | `ProgressManager.cs:264` — `SetCurrentLevelToLastUnlocked` indexes `worldsUnlocked` with `currentLevelIndex + 1` where `currentWorldIndex + 1` is meant; with more than one live world the resume position is wrong. |
| P4 | B | `ProgressManager.cs:222, 233` — `GetScenePath`/`WorldExists` index `gameData.worldData` directly, while `gameProgress` is built only from entries flagged `live`. The two disagree as soon as a non-live world or level precedes a live one. |
| P5 | B | `App/AppController.cs:74–82` — when "next level" crosses into a new world the branch is an empty comment (`// Load world select`); nothing loads and the game stays in `LoadNextLevel`. At the end of the last world `AdvanceToNextLevel` does not change anything, so the last level reloads. There is no game-complete flow. |
| P6 | B | `AppController.LoadWorldMap` builds the path `World{n}_Map`; only `World1_Map` exists. There is no world-select screen. |
| P7 | C | `AppController.cs:65` compares a `Scene` struct with `null` (always false; compiler warning CS0472). `ShowLoadingScreen`/`HideLoadingScreen` are empty, so scene changes have no cover. |
| P8 | C | Save file is rewritten on every token and completion with full `Debug.Log` dumps of its contents; no versioning or corruption handling beyond the file name `kSave_v1_0.json`. |

## Gameplay

| # | Sev | Issue |
|---|---|---|
| G1 | B | `Level/LevelObjectBonusToken.cs:50` passes `CurrentWorldNumber` as both world and level when loading collected state, so every level in world 1 reads level 1's tokens. Saving uses the right numbers. |
| G2 | B | Bonus tokens are hard-wired to three per level (`bool[3]`), and each token's `index` must be set by hand in the scene. Original levels have varying token counts. |
| G3 | B | `Koboto/Koboto.cs:237–246` — `RemoveAttachmentOfType` (the path used when the player toggles a tool off) destroys the tool without calling `OnRemoveFromKoboto`. `AttachmentParachute` relies on that call to reset the centre of mass, so removing an open parachute leaves the creature's centre of mass shifted 3 units up. |
| G4 | B | Only `TreeGuy` exists as a remastered creature; `UpgradeLevel` assigns it to every spawn. Level 9 originally used `Rushton-Blue`. |
| G5 | B | Multi-creature levels are not supported end to end: `Level.SelectKoboto` only ever selects the first creature and nothing lets the player switch; `LevelObjectHome.isOccupied` is never set to true, so two creatures can enter one house. |
| G6 | B | The jetpack starts every level with 0 charges; there is no per-level starting count (original levels specify 0, 1, 2, 4, 25 or 99). |
| G7 | B | `KobotoDeath.Lost` (left the world bounds) and `Squashed` have no reaction in `Koboto.Kill` — the creature is marked dead with no animation or sound. Creature sound effects other than the roll loop are missing generally. |
| G8 | C | `Koboto.cs:198` — `JetpackButtonPressed` dereferences the jetpack without a null check. |
| G9 | C | `Level.cs:79` logs "No object with tag" and then dereferences the null object; `Level.cs:108` throws if the level has no `LevelZoneWorld`. A newly converted level fails with a null reference rather than a clear message. |
| G10 | C | `Game/KobotoMono.cs` subscribes `SetGameState` to a static event in `OnEnable` and never unsubscribes it, so destroyed objects stay referenced across scene loads. `GameEvents`, `Koboto.Events` and `UIEvents` are static and never cleared, which will also misbehave if domain reload on play is disabled. |
| G11 | C | 68 `Debug.Log` calls, several in per-physics-step paths (`LevelZone.AffectKobotoSenses`, `LevelZoneWind`, `AttachmentMagnet`, trigger enter/exit, the wheel-spin loop, the ground-alignment code). Costly and noisy on device. |
| G13 | B | Physics is not the original's. Gravity is −15 where the scaled original is −9.08; the timestep is 100 Hz where the original ran 25 Hz; the original's default `Ice` physics material is absent. Falls are about 29% quicker than in the original. May be deliberate — needs a decision before tuning (doc 03). |
| G12 | C | Tool tuning values are constants inside methods (magnet 400/10/12, jetpack 350 thrust / 0.9 s, alignment distances), so they cannot be tuned per creature or from the inspector. |

## Scenes and content

| # | Sev | Issue |
|---|---|---|
| S1 | B **(log)** | Every remastered level, the world map and the splash scene carry original `.js` components as missing scripts (`SimManager`, `UIManager`, `UIEditor`, `GenericFunctions`, `Tutorial2`, `CameraManager`, `SpawnPoint`, `Connector`, `CurvedSurface`, `platform`, `SplineFollow`, …). They do nothing, but they produce warnings, and Unity 6 flags prefab instances with missing scripts more aggressively. They also still hold the original level data, so they should be converted, not blindly deleted (see doc 07). |
| S2 | A | **Maya model files are missing from the repo.** The original imported `.mb` files directly; they were never committed, and the FBX conversions have different GUIDs. About 2,050 mesh and 640 animation references are unresolved across the original `Levels` and `3-Ed` scene folders (145 scenes, which include all 60 levels). All 60 original level scenes are affected, plus `Level01–05`, `Level09`, `Level10`, `EasyJet` and `house.prefab` in the remaster — those objects render nothing or do not animate (token spin, house animation, butterflies), and any mesh collider built on one of these meshes has no collision shape. The broken prefab instance noted earlier (GUID `5ac905b7…`) is one of these: `plant1.mb`. 33 of the 46 models needed can be fixed by remapping to FBX files already in the repo; 13 have no FBX and must be extracted from the Unity 4 folder (docs 05, 08). |
| S7 | B | Eight physics materials are missing (`Ice` is referenced by 79 files, `Metal` 24, `Rubber` 17, `SpikyRoll` 17, `sticky` 15, `Wood`, `Roll 1`, `Bouncy`). Colliders that used them fall back to default friction and bounce. Recoverable from the Unity 4 folder. |
| S8 | C | Two original scripts are absent from the repo, so their scene data cannot be read through shims until they are added: `fireworks.js` (on the house prefab, 59 levels) and `Button.js` (6 levels). Also missing: `Resources/GameplayParameters.prefab` and the two `kubrikGUISkin` assets. Sixteen HUD PNGs in `Resources` have different GUIDs in the repo than in the original, so original references to them do not resolve. All are in the Unity 4 folder. |
| S9 | C | `Assets/Original/Scenes/Levels/World1/World01_Level03.unity` and `3-Ed/reflectionTest.unity` were edited in place during early remaster work and are no longer faithful copies of the originals. |
| S3 | B | `TreeGuy.prefab` (remastered) still has the original `Anibox` and `MaterialSwitcher` components as missing scripts; `Anibox` drove the sprite-sheet face animation (blinking) and `MaterialSwitcher` swapped face textures, so the creature's face is static. |
| S4 | B | `Remastered/Plugins/Editor/UpgradeLevel.cs` searches for C# `SpawnPoint` and `Connector`. Original scenes use the `.js` versions under different GUIDs, which do not load in 2018.2+, so the tool no longer finds spawn points or connectors in an unconverted original scene. |
| S5 | C | Level 10 contains Boat and Windmill prefabs whose behaviour scripts are dead; needs a play-through to see what is actually missing. |
| S6 | B | Tutorial content (text and five images, configured per level in `Tutorial2` components) is not shown anywhere. By a rough count of the scene data, tutorial steps are configured well beyond the first levels (about 6 in World 1 level 1, 3–5 in levels 2, 3, 5, 7 and 9, and some in World 3), so without them new tools are introduced with no explanation. |

## Rendering and UI

| # | Sev | Issue |
|---|---|---|
| V1 | B **(log)** | Shader `MetalRef` fails to compile (`tex2D` called with a bad argument type). Materials using it render with the error shader. |
| V2 | B **(log)** | Fixed-function `TexGen` and texture-matrix warnings in `DiffuseAmbTransRef`, `DiffuseAmbTransRef2`, `ForegroundThing`, `trophyGlass`, `MetalRef`, `FX/Projector MultiplyFade`: reflection and projector-shadow effects silently do nothing. |
| V3 | B | No shadows under creatures (blob/projector shadow scripts are dead), no per-world fog/background/ground colours (the globals the scenery shaders read are never set by remastered code). |
| V4 | B | HUD canvas reference is 2208×1242 with width matching and no safe-area handling; buttons at screen edges will collide with the notch / Dynamic Island and home indicator on current phones. |
| V5 | C | HUD and menu sprites are 64–142 px sources; blurry on Retina displays. |
| V6 | C | Level cards show "Level N"; `displayName` is empty for all worlds and levels. |

## What could not be checked

- Actual play behaviour of levels 1–10 (physics feel, whether each is completable, camera framing). Needs a play-test pass in the editor.
- Whether the current HEAD compiles — the editor log predates the fast-forward. The six changed scripts are small edits and look self-consistent.
- Behaviour of the shipped game in its own engine. Unity 4.2 cannot be activated; the reference is the Unity 5.6 copy, which uses a newer physics engine (doc 03).
- How the missing meshes look in practice: which objects are invisible in the ten ported levels.
- Device behaviour of any kind; there is no iOS build environment on this machine.
- Per-creature handling differences in the original prefabs.
