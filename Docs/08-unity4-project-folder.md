# 08 — The Unity 4 project folder (`/Original`)

Added 2026-11-10. `G:\UnityProjects\Kubrik\Original` is a local, git-ignored copy of the original project (`KobotoU4/KobotoU4`, Unity **4.2.0f4**, 646 MB) plus a `pngs` folder. This note records what it contains and what can be recovered from it. Docs 01–07 were revised the same day to agree with it.

## What it changed in the earlier docs

| First-pass statement (2026-11-09) | Now |
|---|---|
| "Which 30 levels?" | All **60** shipped (confirmed by Ed). 50 remain to port. |
| World 1 slot 10 is missing; Level10 came from `parachuteSimple` | Slot 10 is **`3-Ed/reflectionTest.unity`** (from the real build list). It is in the repo, but that copy was edited in place during the remaster. Remastered `Level10` derives from it. |
| Branch is behind `master`; no `.gitignore` | `unity2019-upgrade` fast-forwarded to `3e109e3`; `.gitignore` added (ignores `Library/`, `Temp/`, and root `/Original/`). Neither is committed yet. |
| Missing prefab GUID `5ac905b7…` found nowhere | It is `Local Assets/Models/World/plant1.mb`, a Maya file that was never committed. See "Maya models" below. |
| Build order reconstructed from scripts | Read from `ProjectSettings/EditorBuildSettings.asset`: 0 `blank`, 1 `splash_3d`, 2 `3-Ed/worldSelectScreen`, 3 `menu`, 4 `menuSnow`, 5 `menuMachine`, 6–65 the 60 levels in the order listed in `tools/level_missing_assets.py`. `trophyRoom` is not in the list. |
| Source art might exist outside the repo | Maya sources: yes. Higher-resolution textures or music masters: no. Maya itself is not available. |

## What the folder contains

- **Pristine scripts.** 87 of the repo's `.js` files differ from these (963 changed lines; 15 files changed by more than 20 lines — not just the injected `return;`). Use this folder, not `Assets/Original`, as the behaviour reference.
- **Two scripts missing from the repo:** `Plugins/Game/fireworks.js` (referenced by 59 levels via the house prefab) and `Plugins/LevelObject/Button.js` (6 levels).
- **Eight physics materials missing from the repo** (`Standard Assets/Physic Materials`): `Ice` (referenced by 79 repo files), `Metal` (24), `Rubber` (17), `SpikyRoll` (17), `sticky` (15), `Wood`, `Roll 1`, `Bouncy`. Friction and bounce on creatures and props currently fall back to defaults.
- **115 Maya source models** (`.mb`/`.ma`) — see below.
- **Original project settings** (binary, decoded): gravity `(0, -90.81, 0)`, fixed timestep **0.04 s (25 Hz)**, max timestep 0.333, default physics material `Ice`, bounce threshold 1, 7 solver iterations, layer collision matrix all-on. User layers: `Terrain`, `CritterCore`, `Component`, `worldSelect1–4`, `snowflakes`. Company `Qwirkii`, product `Kubrik`, bundle id beginning `com.qwrkii.kobotonew`.
- **Extra audio:** two tracks not in the repo (`kubrik_dark_theme_final1.mp3`, `kubrik_fail_jingle_final1.mp3`), a 96 kbps and a VBR encode of in-game track 1, three M4A demos, and 64 extra WAV effects. No uncompressed music masters.
- **Extra textures:** 105 PNG plus BMP/PSD, including `UI_atlas3.png` (2048²), `levelMap1024X4096.png`, front-end art, `kubrikGUISkin` GUI skins, app icons (largest 512²). Same era and resolution as the repo — **no high-resolution art sources**. The `pngs` folder is identical in size to the sprites already in the repo.
- **`buildTest/`**: an Xcode project and player data for an armv7 iOS build (65 level files). It cannot run on current iOS (64-bit only) but its `Data/*.assets` hold every imported mesh and animation.
- **`Library/`**: Unity 4 import cache, so a Unity 4.2 editor should be able to open and play the project without re-importing — the best available reference for "original playability".
- Scenes, prefabs and materials are **binary** here; the repo's text versions remain the ones to parse. Asset GUIDs match the repo for 1,133 of 1,149 common paths.

## Maya models: the main new problem

The repo never contained the `.mb` files. Level scenes reference them directly: about **2,050 mesh references and 640 animation references** across the original `Levels` and `3-Ed` scene folders (145 scenes, which include all 60 levels) point at GUIDs that do not exist in the repo, and **every one of the 60 levels** is affected (trees, floors, houses, tokens, scales, caves, caterpillar, butterflies). Nine remastered files are affected too (`Level01–05`, `Level09`, `Level10`, `EasyJet`, `house.prefab`). These objects have no mesh or no animation today.

46 distinct models are needed by the 60 levels:

- **24 already have an FBX in the repo with identical sub-asset IDs** (`*_fbx.fbx`, different GUID): `puzzle001B_floor`, `world1_tree01/02/03`, `plant1`, `Cloud2D`, `rollingshell`, `floorPlain`, `switchup`, `switchdown`, `tiltboard`, `Scales`, `balloonholder`, `puzzle001_floor`, `spikes`, `physics_wedge`, `World1Waterplane`, `genericLandPiece`, `sadcloud`, `w1_bgTree2`, `poyo`, `snowTree`, `stomper`, `rampbird`. Fix: a scripted GUID remap in scene and prefab text. No Maya needed.
- **9 have an FBX but IDs differ** (mostly the animation clip is named differently): `token`, `world1_house`, `world2_house`, `world3_house`, `butterfly`, `treeguy`, `falltree`, `owlFace`, `sky1`. Fix: remap with a per-model ID table.
- **13 have no FBX at all:** `bambooA`, `hungry_caterpillar` (47 meshes, 75 clips), `w1_bgTree`, `snow1`, `snow2`, `snow3`, `snow1_lb`, `CAVE1`, `CAVE2`, `CAVE3`, `jetPakIceMonsta`, `chase_slope`, `tutorialSign1@On`. These are mostly World 2 and 3 level geometry: `CAVE1–3` (World 2 slot 5), `snow1–3` (slot 2), `snow1_lb` (slot 17), `jetPakIceMonsta` (slot 7), `chase_slope` (slot 19), `bambooA` (17 World 3 levels), `hungry_caterpillar` (World 3 slots 8, 9, 17), `w1_bgTree` (World 1 slot 20), `tutorialSign1@On` (World 3 slot 18).

Maya is not available, so these 13 cannot simply be re-exported. The recovery routes, in order of preference, are in doc 07 Phase 0: export the cached meshes and clips from the Unity 4 editor; extract them from `buildTest/Data`; borrow Maya later for the one complex rig (`hungry_caterpillar`).

How the references break down by kind (those 145 scenes plus the original prefabs): `m_Mesh` 2,091, `m_Animation` 660, prefab-parent links about 1,160, property-override targets about 230. Only the first two matter for restoration; the prefab-parent links were connections to the imported model and can be left broken.

## Effect on the plan

Folded into [07-upgrade-plan.md](07-upgrade-plan.md): scope is 60 levels; Phase 0 gains "run the original in Unity 4.2 and record it" and an asset-recovery step; a physics-target decision (D9) was added because the original ran gravity −90.81 at 10× scale (−9.08 at the remaster's scale) at 25 Hz against the remaster's −15 at 100 Hz.

## Tools

`tools/missing_guids.py` lists unresolved asset references and which of them the Unity 4 copy can supply. `tools/level_missing_assets.py` reports missing models per level and holds the authoritative 60-level build order. Both are read-only.
