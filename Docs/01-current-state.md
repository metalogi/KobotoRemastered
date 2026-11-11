# 01 — Current state of the project

## Repository

| | |
|---|---|
| Remote | `https://github.com/metalogi/KobotoRemastered.git` |
| Working branch | `unity2019-upgrade`, pushed to and tracking `origin/unity2019-upgrade` |
| Baseline | Tag `baseline-2019.1` on `727115f` (2026-11-10): the last 2019-era code (`3e109e3`, 2019-11-23, "tilt changes and wheel fixes") plus these docs, the `.gitignore` and the editor's clean-up. Pushed to origin |
| `master` | Still at `3e109e3`, one commit behind the working branch; it does not have `Docs/` or the `.gitignore` |
| Commits | 68 at the baseline tag |
| Tracked files | about 3,500 (half are `.meta`) |
| `.gitignore` | Committed in the baseline. Ignores Unity-generated folders and the root `/Original/` folder |
| Git LFS | Not used. Binary art is committed directly (~48 MB `.git`) |

The branch was fast-forwarded from `552afc6` to `3e109e3` on 2026-11-10. That last commit (36 files) touched `Koboto.cs`, `KobotoSensor.cs`, `AttachmentWheels.cs`, `AttachmentPropeller.cs`, `AttachmentBase.cs`, `Utils.cs`; the `TreeGuy`, `Wheels`, `Propellor` and `Spring` prefabs; a new spoked-wheel model and textures; and re-saved `Level01/02/03/04/07/09`. It adds a visual tilt pivot on the creature, wheel-spin animation, camera pivot offsets per attachment, and retuned air/ground alignment. Input, progression, build settings and project settings were not changed by it. Line numbers quoted in doc 06 for `Koboto.cs` were taken at `552afc6` and have shifted slightly.

### What the baseline commit added

`727115f` holds everything from the 2026 audit on top of the 2019 code:

- New: `.gitignore`, `Docs/`.
- Removed by the Unity 2019.1.10f1 editor on opening: five orphaned folder `.meta` files (`Assets/Original/Prefabs/NewKoboto.meta`, `Assets/Original/Scripts.meta`, `Assets/Remastered/Shaders.meta`, `Assets/Remastered/Sound.meta`, `Assets/Remastered/VFX 1.meta`). The folders they describe were empty and so were never in git.
- Rewritten by the editor: `ProjectSettings/VFXManager.asset` (binary to text).

### Local, untracked: the Unity 4 project

`/Original/KobotoU4/KobotoU4` is a complete copy of the original project (Unity 4.2.0f4, 646 MB with its `Library` and an old iOS build). It is git-ignored. It holds assets and settings the repo lacks; see [08-unity4-project-folder.md](08-unity4-project-folder.md).

## History

| Date | Commit | Unity | Milestone |
|---|---|---|---|
| 2012 → 2013-09 | (not in git) | 3.5 → 4.2.0f4 | Original game. Last files in the Unity 4 folder are dated September 2013 |
| 2017-05-29 | `18eb5a4` | 5.x / 2017 (not recorded) | Original Unity 4 project imported with its `.js` scripts neutralised by `return;` statements at the top of `Awake`/`Start`/`Update` |
| 2017-06 → 2017-12 | | 2017.2.0f3 (first recorded `ProjectVersion.txt`, `2426976`) | C# rewrite begins: creature, attachments, state machine, input, menus, music, save data |
| 2017-06-24 | `044b0dd` | | NGUI and other unused original folders removed |
| 2017-12-16 | `eec3b0b` | | Original files moved under `Assets/Original` |
| 2017-12 → 2018-08 | | | Spring, propeller, hammer, breakables, parachute, level zones, quad wheels, camera zones |
| 2018-09-02 | `03b6564` | 2018.2.6f1 | Upgrade to 2018 (UnityScript support ends here). Progress manager rewrite, drowning, jetpack, events revamp |
| 2019-07-20 | `552afc6` | 2019.1.10f1 | Upgrade to 2019. Connector mesh generator ported to C# |
| 2019-11-23 | `3e109e3` (`master`) | 2019.1.10f1 | Tilt and wheel fixes — last work on the project |

The Unity 4 project is not in git as a runnable snapshot: the earliest commit already has the scripts disabled, lacks the Maya model files, and has no `ProjectSettings` from that era. The local Unity 4 folder fills those gaps, including the original build-scene order ([04-level-inventory.md](04-level-inventory.md)).

## Editor and compile status

Verified from `%LOCALAPPDATA%\Unity\Editor\Editor.log` for the 2026-11-09 session, when the working tree was at `552afc6`. The project has not been recompiled since the fast-forward; the six scripts that changed are small edits and are expected to compile.

- Unity **2019.1.10f1** opens the project and produces `Assembly-CSharp.dll` and `Assembly-CSharp-Editor.dll` — **no C# errors**, 44 distinct warnings in project code (unused fields, a few obsolete API calls).
- Shader error: `MetalRef` (`Assets/Original/Local Assets/Shaders/metalmeth*.shader`) does not compile.
- Shader warnings: fixed-function `TexGen` and texture matrices are ignored in several shaders, so the reflection / eye-linear effects they produced in Unity 4 are gone.
- "The referenced script on this Behaviour is missing" is logged for many objects (`SpawnPoint`, `Connector`, `platform`, `cloud`, `SoundManager`, `MainCamera`, `Level`, …). These are the original `.js` components.

## Folder layout

```
Assets/
  Original/                 Unity 4 game. Art and scenes are live dependencies; scripts are dead.
    Plugins/                160 .js gameplay scripts (Core, Game, Component, LevelObject)
    Editor/                 25 .js and 4 .cs level-building tools
    Local Assets/           Models (FBX conversions; the Maya sources are not in the repo), textures, materials, 40 custom shaders
    Prefabs/                Creatures (Base), tools (Components), LevelObject, World scenery, Audio
    Scenes/                 199 scenes: Levels/World1 (9), 3-Ed (136), 1-jade (30), 0-karim (9), 2-Jo (4), menus, tests
    Resources/              UI textures, fonts, SoundManager prefab
    FX/, AUDIO/             47 WAV effects, 8 MP3 + 2 M4A music
    Standard Assets/        Unity 4/5 legacy Image Effects package
  Remastered/               2017–2019 C# rewrite
    Scripts/                App, Game, Koboto, Attachments, Level, Camera, PlayerInput, UI, Music, Utils, Generation
    Editor/, Plugins/Editor Level upgrade and connector tools, custom inspectors
    Resources/              Game.prefab, cameras, attachments, TreeGuy, house, music prefabs, GameData.asset
    Scenes/                 Splash, Main, World1_Map, World1/Level01–10, EasyJet, hammersetup
    Animation/, Sprites/, Music/, VFX/, Materials/, PhysicsMaterials/, SplashScreen/, Audio/
Packages/manifest.json
ProjectSettings/
Maya/                       One Maya file (Wheel.mlt) added by the last commit
Docs/                       These documents and the audit scripts
Original/                   Local copy of the Unity 4 project (git-ignored)
```

Sizes: `Assets` 174 MB on disk, of which scenes are 90 MB (text-serialised YAML).

## Packages (`Packages/manifest.json`)

All are 2019-era defaults; none is used by game code.

| Package | Version | Status for Unity 6 |
|---|---|---|
| `com.unity.ads` | 2.0.8 | Remove |
| `com.unity.analytics` | 3.3.2 | Remove (service retired) |
| `com.unity.purchasing` | 2.0.6 | Remove |
| `com.unity.collab-proxy` | 1.2.16 | Remove (Collaborate retired) |
| `com.unity.multiplayer-hlapi` | 1.0.2 | Remove (UNet removed) |
| `com.unity.package-manager-ui` | 2.1.2 | Remove (built into editor) |
| `com.unity.xr.legacyinputhelpers` | 2.0.2 | Remove |
| `com.unity.timeline` | 1.0.0 | Not used; remove or let the editor update it |
| `com.unity.modules.*` | 1.0.0 | Keep only what is used (physics, animation, audio, particles, ui, imgui, jsonserialize, imageconversion) |

uGUI is referenced through the pre-2019.2 built-in extension DLL (GUID `f70555f144d8491a825f0804e09c671c`). Unity remaps this to the `com.unity.ugui` package on upgrade.

## Project settings worth knowing

| Setting | Value | Note |
|---|---|---|
| Product / company | `KubrikRemastered` / `DefaultCompany` | Placeholders |
| Bundle identifier | `com.Company.ProductName` | Placeholder |
| Scripting runtime | Legacy (.NET 3.5 equivalent), API level .NET 2.0 | Removed in later Unity versions |
| Scripting backend | Not set per platform | iOS requires IL2CPP |
| iOS target | iPhone + iPad, minimum iOS 7.0 | Far below anything Unity 6 supports |
| Orientation | Default Landscape Right; all four autorotation flags on | Tilt control needs a locked landscape orientation |
| Colour space | Gamma | |
| Rendering | Built-in pipeline, Forward | |
| Physics | Gravity `(0, -15, 0)`, fixed timestep `0.01` s (100 Hz), contact offset `0.001`, 8 solver iterations | Tuned for the remaster's 0.1× world scale |
| Tags | `Junction`, `interfaceSound`, `house`, `soundManager`, `musicPlayer`, `wall`, `magnetic`, `Node`, `domino`, `reflectionPlane`, `K_HOUSE1`, `K_GAMECAM`, `K_MAP_CAM`, `K_INTRO_CAM`, `K_WIN_CAM` | `magnetic` and the `K_*` camera tags are used by remastered code |
| Layers | Only `foregroundBlur` (20) is custom | Original collision-layer tricks are not set up |

### Build scene list (`EditorBuildSettings.asset`)

`Splash`, `Main`, `World1_Map`, `Level01`, `Level02`, `Level03`, `Level04`, `Level05`, `Level07`, `Level06`.

`level08`, `Level09`, `Level10`, `EasyJet` and `hammersetup` are **not** in the list. `GameData.asset` nevertheless marks levels 1–10 as live.

## What the game does today

Flow, as implemented in `Assets/Remastered`:

1. `Splash.unity` — animated logo; a button calls `SimpleSplash.LoadMain()`.
2. `Main.unity` — holds `AppController` and the `Game` prefab (game manager, input, in-game UI). `AppController.Start()` loads the World 1 map additively.
3. `World1_Map.unity` — draggable map with a house per unlocked level. Tapping a house shows a card; tapping again or pressing play calls `AppController.LoadLevel`.
4. Level scene loads additively, intro camera plays, then play state: tilt (or A/D in the editor) to roll the creature, toggle tools with the buttons on the right, reach the house. Win shows fireworks and next/retry/menu buttons. A binocular button gives a free-look map camera; pause is supported.
5. Progress and bonus tokens are saved as JSON at `Application.persistentDataPath/Koboto/kSave_v1_0.json`.

Any level scene can also be opened and played directly in the editor: `Level.Start()` instantiates the `Game` prefab if no `GameManager` exists.

### Feature status versus the original

| Area | Original (Unity 4) | Remastered today |
|---|---|---|
| Worlds | 3 (forest, snow, machine/jungle) + world-select screen | World 1 map only. Worlds 2 and 3 exist as placeholder rows in `GameData.asset` pointing at World 1 scenes |
| Levels | 60 (20 per world), all scenes present | 10 in `GameData`, 7 in build settings, plus 2 work-in-progress scenes |
| Physics | Gravity −90.81 at 10× scale, 25 Hz, `Ice` as default physics material | Gravity −15 at 0.1× scale, 100 Hz; the original physics materials are not in the repo |
| Models | Maya files imported directly | FBX conversions for some; every level has unresolved mesh and animation references ([08](08-unity4-project-folder.md)) |
| Creatures | 13 prefabs, 8 used by levels | `TreeGuy` only |
| Tools | Wheels, quad wheels, spring, magnet, propeller, parachute, hammer, jetpack, catapult (+ unused ice block, skateboard, wall button) | All except catapult |
| Multi-creature levels | 11 slots | Spawning works; selection switching and per-house occupancy do not |
| Hazards / objects | ~70 level-object scripts | Kill zone, home, bonus token, line-following platform, rotator, breakable wall, jetpack pickup, wind zone, camera zones, fireworks |
| Tutorial overlays | `Tutorial2.js`, `TutTrigger.js`, 5 tutorial images | None |
| Audio | Music per world, ~45 effects through `SoundManager`/`KobotoSounds` | Music player with fades; roll loop and jetpack burn only |
| Trophy room | Yes | None |
| Save data | `PlayerPrefs` | JSON file |
| UI | Immediate-mode `OnGUI` with `GUISkin` | uGUI canvas, 2208×1242 reference |

Details of what each level needs are in [04-level-inventory.md](04-level-inventory.md); defects are in [06-known-issues.md](06-known-issues.md).
