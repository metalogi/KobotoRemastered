# 03 — The Unity 4 original

The original is the specification for "original playability". It exists in two places:

| | `Assets/Original` (in the repo) | `/Original/KobotoU4/KobotoU4` (local, git-ignored) |
|---|---|---|
| Scripts | Modified: 87 of 187 `.js` files differ from the originals | Pristine |
| Scenes, prefabs, materials | Text YAML — parseable, and what Unity 6 will read | Binary (Unity 4.2) — needs an editor to read |
| Models | FBX conversions for some; no Maya files | All 115 Maya source files |
| Project settings | None from the Unity 4 era | Complete (binary) |
| Can it run? | No | Should open and play in Unity 4.2.0f4 |

Use the repo copy for level data and the local copy for behaviour, settings and missing assets. Asset GUIDs agree between the two for 1,133 of 1,149 shared paths, so references carry across. Doc [08](08-unity4-project-folder.md) lists what the local copy adds.

## Why the scripts are dead

- All gameplay is UnityScript (`.js`): 160 files under `Plugins/`, 25 editor tools, 2 strays. Unity removed the UnityScript compiler in 2018.2, so from the 2018 upgrade onward these files are inert and every component that used them shows as a missing script.
- Before that, the first commit (`18eb5a4`) had already neutralised them by inserting `return;` at the top of lifecycle functions (`Awake`, `Start`, `Update`, …) so the old and new systems would not fight. A few functions were renamed instead (for example `SpawnPoint.oldAwake`), and Unity's API updater rewrote other lines along the way: 15 files differ from the originals by more than 20 lines. The Unity 4 folder has the untouched versions, plus two scripts the repo lacks entirely (`Plugins/Game/fireworks.js`, `Plugins/LevelObject/Button.js`).
- **Serialised data survives.** Scenes and prefabs are text YAML and still hold every field value of the missing components (tool lists, spline timings, spawn types, trigger wiring). Unity keeps this data as long as the component is not removed.

## Original game flow

Scenes were loaded by build index. The order below is read from the Unity 4 project's `EditorBuildSettings.asset` (66 scenes, all enabled); the purposes come from `StartUp.js`, `SplashScreen*.js`, `WorldSelectScreen.js`, `WorldLoader.js`, `MenuHud.js` and `UIManager.js`.

| Build index | Scene | Purpose |
|---|---|---|
| 0 | `blank` | Start-up: forces landscape, loads index 1 |
| 1 | `splash_3d` | Title screen with clouds, logo, social links |
| 2 | `3-Ed/worldSelectScreen` | Swipe between three worlds; locked worlds are dark; unlock animation |
| 3–5 | `menu`, `menuSnow`, `menuMachine` | Per-world level map: a path of houses (`LevelSelectButton`), 21 buttons each, a card with level name, bonus stars and a play button |
| 6–25 | World 1 levels | |
| 26–45 | World 2 levels | |
| 46–65 | World 3 levels | |
| — | `trophyRoom` | Trophy cabinet driven by lifetime stats. **Not in the build list**, so it was not in this version of the shipped game |

In a level, `UIManager.gameMode` was: `1` play, `2` intro camera, `3` pause menu (music volume, tilt sensitivity, tilt on/off), `4` complete, `5` free-look camera. Mode `0` was an edit mode inherited from an earlier design and is marked defunct in the code. The remaster's `EGameState` mirrors modes 1–5.

Progress lived in `PlayerPrefs`: `LevelsCompleted` (a build index), `WorldsUnlocked`, `CurrentLevel`, `WorldNumber`, per-level `<index>_BonusStarsFound` / `<index>_BonusStarCount` / `<index>_LevelPlayed`, settings (`MusicVolume`, `GlobalVolume`, `TiltSensitivity`), and stats used by the trophy room (`SavedKobotos`, `DeadKobotos`, `DrownedKobotos`, `ImpaledKobotos`, `SquashedKobotos`, `FlippedKobotos`, `JetPacksUsed`, `ThingsSmashed`, `TotalBonusTokens`, `TimesPlayed`, `GameComplete`).

## Script map

Line counts show where the logic is concentrated.

| Script | Lines | Role | Remastered counterpart |
|---|---|---|---|
| `Core/Juncore.js` | 2,429 | The creature: all movement, every tool's physics, platforms, speed ramps, magnets, drowning, death, celebration | `Koboto`, `KobotoSensor`, `Attachment*` |
| `Game/CameraManager.js` | 1,024 | Follow camera, intro fly-through, drag/zoom, interest zones, music start/stop, win sound | `CameraController`, `GameCam`, `DragCam`, `IntroCam` |
| `Game/GenericFunctions.js` | 987 | Touch helpers, screen-space maths, tilt reading (`Input.gyro.gravity.x`), misc utilities | `InputManager`, `UIEvents`, `Utils` |
| `Game/UIManager.js` | 732 | In-level HUD and game modes (immediate-mode GUI) | `GameManager`, `UIGame` |
| `Game/Tutorial2.js` | 585 | Scripted tutorial steps: text and image overlays, wait-for conditions, highlights | none |
| `Game/UIEditor.js` | 509 | Tool buttons; holds the per-level `components[]` list (tool prefab + count) | `Level.availableAttachments`, `UIAttachmentButton` |
| `LevelObject/Connector.js`, `RuntimeConnector.js` | 497, 384 | Procedural curved floor between platforms | `Generation/Connector.cs` |
| `Game/SimManager.js` | 386 | Spawns creatures, tracks rescued count, reset, bonus-token saving, two-creature selection UI | `Level`, `GameStatePlay`, `ProgressManager` |
| `Game/SplashScreen2D/3D.js`, `MenuHud.js`, `WorldSelectScreen.js`, `TrophyRoom.js` | ~1,500 | Front end | `SimpleSplash`, `WorldMap`, `LevelSelector` (World 1 only) |
| `Component/Addon.js`, `Core/MountPoint.js` | 102, 68 | A tool instance and the mount point it attaches to | `AttachmentBase`, `KobotoAttachPoint` |
| `Component/JetPack.js`, `HammerMuscle.js`, `CatapultMuscle.js`, `LegsMuscle.js`, `ParaSwapper.js`, `PickUpComponent.js` | 40–100 each | Tool-specific behaviour not inside `Juncore` | `AttachmentJetpack`, `AttachmentHammer`, `LevelObjectJetpackPickup`; catapult and legs: none |
| `Core/KobotoSounds.js`, `Game/SoundManagerScript.js` | 98, 42 | Creature voice and effects: roll, impact, fall, excited, celebrate, death, whoops, spring | `KobotoSoundPlayer` (roll only) |
| `LevelObject/*.js` | 79 files | Level objects, see [04-level-inventory.md](04-level-inventory.md) for which levels use which | Partly ported |
| `WorldObjectDefs.js`, `GameplayParameters.js` | 276, 46 | Level list, per-world scenery names, camera and tilt settings | `GameData.asset` (levels only) |

`GameplayParameters.js` records the original tuning hooks: camera distance 400, FOV 45, angle 5, height 50 (in original 10× units), `TiltSensitivityMultiplier = 1`, `TiltClampValue = 0.04`, and a `UseSwipeControls` switch. Those are script defaults; the values actually used were serialised in `Resources/GameplayParameters.prefab`, which exists only in the Unity 4 folder (binary).

## Original project settings

Decoded from the binary `ProjectSettings` in the Unity 4 folder.

| Setting | Original | Remaster |
|---|---|---|
| Gravity | `(0, -90.81, 0)` in a world 10× larger — equivalent to **−9.08** at the remaster's scale | −15 |
| Fixed timestep | **0.04 s (25 Hz)**, maximum 0.333 s | 0.01 s (100 Hz) |
| Default physics material | `Standard Assets/Physic Materials/Ice` | None (Unity default) |
| Bounce threshold, solver iterations | 1 (10× units), 7 | 2, 8 |
| Sleep velocity / angular velocity | 0.15 / 0.14 | Sleep threshold 0.005 |
| Layer collision matrix | Everything collides; filtering was done in script (`NoWorldCollision`, `IgnoreCollisions`, …) | Default |
| User layers | `Terrain`, `CritterCore`, `Component`, `worldSelect1–4`, `snowflakes` | `foregroundBlur` only |
| Extra tags | `levelCam`, `noSplash`, `monsta` | — |
| Company / product / bundle id | `Qwirkii` / `Kubrik` / begins `com.qwrkii.kobotonew` | Placeholders |

With gravity at 1.65× the scaled original, a fall of one creature-height takes about 0.37 s in the remaster against 0.47 s in the original. Whether that was a deliberate choice should be settled before tuning, because every jump, bounce and parachute timing depends on it. The 25 Hz original timestep also means original force and damping values were tuned at a much coarser step and will not transfer by scaling alone.

## Creatures

Prefabs in `Prefabs/Base/`: `TreeGuy`, `Rushton-Blue/Pink/Yellow`, `tvBunny-Blue/Pink/Yellow`, `Fisheye`, `Poyo`, `ShoeBox`, `FoxInABox`, `Pnonito`, `Rampy`. The 60 levels use eight of them: `TreeGuy`, `Rushton-Blue`, `Rushton-Yellow`, `tvBunny-Blue`, `tvBunny-Yellow`, `Fisheye`, `Poyo`, `ShoeBox`. Each prefab carries its own serialised `Juncore` values (mount points, tilt, auto-walk, magnet, spring, propeller, parachute definitions), so creatures may differ in handling as well as looks — this has not been compared field by field yet.

## Tools

Prefabs in `Prefabs/Components/`: `DoubleWheels`, `QuadWheels`, `Spring`, `Magnet`, `Propellor`, `Parachute`, `Hammer`, `JetPack` (+ `JetPackSpent`, `JetpackPickUp`), `Catapult`, and three that no listed level offers: `IceBlock`, `Skateboard`, `WallButton`. Each level's `UIEditor.components[]` lists the tool prefabs offered and a count. For most tools the count appears to be how many are available at once (it is 2 on several two-creature levels). For the jetpack it is the starting number of charges (`0` means pickups only; `99` and `25` appear on two levels).

## How to mine the original

1. **Read behaviour from the `.js` source in the Unity 4 folder** (`/Original/KobotoU4/KobotoU4/Assets/Plugins`), which is unmodified. `Juncore.FixedUpdate` (roughly lines 889–1960 in the repo copy) is the reference for how each tool should feel.
2. **Read level data from scene YAML.** Each `.js` file's GUID is in its `.meta`; search a scene for `guid: <that guid>` to find every instance and its field values. The scripts in [tools/](tools/README.md) (`scene_usage.py`, `level_manifest.py`) do exactly this and produced the tables in doc 04.
3. **Let Unity read it for you** by giving a C# class the same GUID and field names as the `.js` it replaces — see "GUID-preserving shims" in [07-upgrade-plan.md](07-upgrade-plan.md). This is the most reliable route for bulk level conversion.
4. **Compare against the remaster at 0.1× scale.** Distances, speeds and forces in original scenes and scripts are in 10× units.

## Reference build

The Unity 4 folder is the reference. It is a complete project saved by **Unity 4.2.0f4** with its `Library` import cache, so that editor version (still available from Unity's download archive) should open it and play every level in the editor without re-importing anything. This has not been tried yet. Two cautions:

- If the editor decides to re-import the Maya files it will fail, because Maya is not installed. Work on a copy of the folder and do not delete `Library`.
- The folder also contains `buildTest/`, an Xcode project and player data for an armv7 iOS build. It cannot run on any current iPhone (64-bit only since iOS 11), but its `Data/*.assets` files contain every imported mesh, animation and texture and can be read by asset-extraction tools.

Once the original runs in the editor, record each of the 60 levels being completed. Those recordings are the acceptance reference for level restoration.
