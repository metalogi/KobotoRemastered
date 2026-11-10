# 05 — Assets and rendering

Figures come from reading file headers and asset YAML across `Assets/` (script: [tools/asset_inventory.py](tools/asset_inventory.py)). Nearly all art lives in `Assets/Original` and is referenced directly by the remastered scenes and prefabs.

## Inventory

| Type | Count | Size | Notes |
|---|---|---|---|
| Scenes (`.unity`) | 214 | 90 MB | Text YAML; 199 original, 15 remastered |
| Textures (`.png .bmp .psd .tga .jpg .tif`) | 284 | 45 MB | 68 are uncompressed BMP; 13 PSD sources |
| Models (`.fbx`) | 76 | 5.6 MB | Very low-poly, flat-shaded style. Conversions of Maya files that are not in the repo; incomplete (see Models) |
| Materials (`.mat`) | 350 | | 338 original |
| Prefabs | 192 | 3.5 MB | 163 original |
| Shaders | 101 | | 40 custom + 61 from the legacy Image Effects package |
| Audio effects (`.wav`) | 47 | 2.8 MB | |
| Music (`.mp3`, `.m4a`) | 16 + 2 | 17.7 MB | 8 tracks at 64 kbps, duplicated in `Remastered/Music` |
| Animation clips / controllers | 15 / 14 | | All remastered (UI, house, jetpack, hammer) |
| Fonts (`.ttf`) | 10 | | Arista, `Cont*` (Continuum bold/light/medium, going by file names), Stencil Std |

## Textures

Longest edge, 281 files with readable headers:

| | ≤64 | ≤128 | ≤256 | ≤512 | ≤1024 | >1024 |
|---|---|---|---|---|---|---|
| Original | 43 | 75 | 51 | 54 | 15 | 0 |
| Remastered | 7 | 13 | 10 | 5 | 8 | 0 |

By area:

| Folder | Files | Median | Largest | Used for |
|---|---|---|---|---|
| `Local Assets/Textures/world` | 69 | 128 | 1024 | Platforms, scenery, backgrounds |
| `Local Assets/Models/Characters` (embedded) | 64 | 128 | 1024 | Creature faces and bodies |
| `Local Assets/Textures/characters` | 18 | 256 | 1024 | Creature textures |
| `Local Assets/Textures/FrontEnd` | 13 | 256 | 1024 | Splash and menu art |
| `Local Assets/Textures/Tutorial` | 5 | 288 | 304 | Tutorial overlays |
| `Local Assets/Textures/FX` | 7 | 64 | 128 | Particles |
| `Gizmos/` tool icons | 14 | 128 | 512 | Tool buttons (`HUDATLAS.png` is 512) |
| `Resources/` + `Remastered/Sprites/Misc` | ~25 each | 128–142 | 1024 | HUD buttons, cards, loading screen (the remastered set is a copy at the same resolution) |
| `Remastered/SplashScreen` | 14 | 256 | 1024 | Splash layers sized for 960-wide iPhone and 1024-wide iPad |

For scale: the original targets were 480×320 and 960×640 phones and the 1024×768 iPad. A current iPhone is roughly 2556×1179 to 2868×1320, so a 128 px HUD icon that once covered a quarter of the screen height now needs about 300 px to stay sharp, and full-screen art needs to be about three times its current width.

What will and will not survive:

- **Flat-colour world textures** (most of the 128 px set) are tiling colour swatches and soft gradients. Many will hold up under filtering; some can be replaced by plain material colours.
- **Character faces, logos, splash art, HUD icons, tutorial images** are the visible problem. These need new exports, redrawing, or upscaling.
- **Source files**: the Unity 4 folder was checked for better 2D sources and has none. Its 105 extra PNGs (plus BMP/PSD) are the same era and resolution: the largest are one 2048² UI atlas (`Resources/UI_atlas3.png`), a 4096×1024 level-map strip, and 1024² front-end art; app icons top out at 512². The separate `/Original/pngs` folder is pixel-for-pixel the HUD sprites already in the repo. So 2D art has to be upscaled or redrawn; there is nothing to re-export from.

## Models

The repo has 76 FBX files (about 5.6 MB): cube creatures, tools, platforms, trees, houses, world-select set pieces. The low-poly look is the art style rather than a limitation, so geometry needs little beyond checking normals/smoothing groups on import and adding bevels where silhouettes look harsh at high resolution. Import settings should be reviewed after the upgrade (the model importer changed defaults for materials and normals between Unity 4 and 6).

**The FBX files are conversions, and the set is incomplete.** The original project imported Maya `.mb` files directly; those were never committed. The FBX conversions (`*_fbx.fbx`) got new GUIDs, and the level scenes were not re-pointed, so across the original `Levels` and `3-Ed` scene folders (145 scenes, which include all 60 levels) about 2,050 mesh references and 640 animation references point at Maya-file GUIDs that do not exist in the repo. All 60 levels are affected, and so are nine remastered files. The Unity 4 folder has all 115 Maya files. Of the 46 models the levels need:

| Situation | Models | Recovery |
|---|---|---|
| FBX in repo with identical mesh and clip IDs | 24 (trees, floors, plant, scales, switches, stomper, …) | Scripted GUID remap in scene and prefab text |
| FBX in repo, IDs or clip names differ | 9 (`token`, three houses, `butterfly`, `treeguy`, `falltree`, `owlFace`, `sky1`) | Remap with a per-model ID table; check animations play |
| No FBX anywhere | 13 (`bambooA`, `hungry_caterpillar`, `w1_bgTree`, `snow1/2/3`, `snow1_lb`, `CAVE1/2/3`, `jetPakIceMonsta`, `chase_slope`, `tutorialSign1@On`) | Maya is not available, so extract meshes and clips from the Unity 4 `Library` or `buildTest/Data` (see doc 07) |

Full lists are in [08-unity4-project-folder.md](08-unity4-project-folder.md); `tools/level_missing_assets.py` reports them per level.

## Physics materials

The original's eight physics materials (`Ice`, `Metal`, `Rubber`, `SpikyRoll`, `sticky`, `Wood`, `Roll 1`, `Bouncy` in `Standard Assets/Physic Materials`) are not in the repo. `Ice` alone is referenced by 79 repo files (creature prefabs, level geometry) and was the project-wide default material. Their friction and bounce values are part of how levels play. They are small text-convertible assets in the Unity 4 folder and should be copied across with their `.meta` files so the existing references resolve.

## Shaders and materials

All 40 custom shaders in `Local Assets/Shaders` and `Local Assets/Materials` are **fixed-function ShaderLab** (`SetTexture`/`Combine`, `Material {}` blocks, `Fog {}` blocks) with no HLSL. Typical example, `Scenery.shader`: one alpha-blended pass, texture × tint, linear fog using a global `_sceneFog` colour and per-material start/end.

Families:

| Family | Shaders | Purpose |
|---|---|---|
| Scenery | `Scenery`, `SceneryNoFog`, `ScenerySolid`, `SceneryDoubleSided`, `SceneryBackground`, `SceneryFogW3` | Alpha-blended cards with tint and fog |
| World 3 | `w3_1` … `w3_5` | Layered fog/tint variants |
| Lit | `diffuseLight`, `basic`, `diffuseAmbTrans`, `diffuseAmbTransRef`, `diffuseBG` | Vertex-lit diffuse with ambient term |
| Unlit | `FlatColor`, `FlatColorBG`, `NoLighting`, `NoLightingTint`, `Background`, `BackgroundBG`, `additiveFG`, `ForegroundThing` | Flat colour / unlit texture, queue-sorted background and foreground |
| Special | `Water`, `OceanShader`, `island`, `Monsta`, `metalmeth`, `trophyGlass`, `snowGlobeFlakes`, `SplashScreenBG`, `SplashShadow`, `ShadowProjection` | Water, reflections, projector shadow, splash |

Material assignments (350 materials): roughly 110–130 use the custom shaders (most common: `diffuseLight` 22, `basic` 11, the Scenery family ~26, `w3_*` 21); 109 use the built-in legacy Diffuse shader; 82 use the built-in Standard shader (most likely default materials created by later model re-imports); the rest use other built-ins (transparent, particle).

Known breakage already present in 2019.1:

- `MetalRef` (`metalmeth.shader`) fails to compile.
- `TexGen` and fixed-function texture matrices are ignored (removed in Unity 5), which disables the sphere/eye-linear reflection look in `diffuseAmbTransRef`, `ForegroundThing`, `trophyGlass`, `metalmeth`, and the projector shadow shader.

Implications:

- The Built-in Render Pipeline still accepts fixed-function shaders, so the upgrade to Unity 6 does not by itself force a shader rewrite.
- The Universal Render Pipeline does not support fixed-function lighting, legacy fog blocks or projectors. Moving to URP means rewriting these as roughly six to eight Shader Graph or HLSL shaders (scenery card with fog, lit flat colour, unlit, background/foreground layers, water, reflection/metal, particles) and remapping the materials that use them. The ~190 materials on built-in legacy Diffuse and Standard shaders can go through Unity's material converter. Because the shaders are simple, this is contained work.
- Fog, ground-plane colour and background colour were driven per world by globals set from script (`WorldObjectDefs.SetBGColors`, `_sceneFog`, `_GroundPlaneColor`). The remaster does not set them; world look-and-feel data needs a home (a per-world ScriptableObject).

## Original rendering features not carried over

| Feature | Original implementation | State |
|---|---|---|
| Creature shadows | `BlobShadow.js`, `ProjShadow.js`, projector + `ShadowFalloff.psd` | Not running. Replace with real-time shadows or a decal |
| Planar reflections | `MReflection.js`, `ReflectionManager.js`, `reflectionPlane` tag | Not running (used by 1 listed level) |
| Ocean / water | `OceanFloat.js`, `OceanWave.js`, `Water.shader` | Not running; `World1BackgroundSea` prefab is used by Level10 |
| Snow | `Snow.js`, `SnowGlobe.js`, `snowGlobeFlakes.shader` | Not running (World 2, world-select) |
| Foreground blur | `foregroundBlur` layer | Layer exists; no effect attached |
| Image effects | `Standard Assets/Effects/ImageEffects` (61 shaders plus scripts) | Not referenced by any remastered scene or prefab examined; safe to delete |

Present in the remaster: real-time lights (`W1Lights.prefab`), particle dust and fireworks, `LineRenderer` magnet beam and balloon cables, material alpha fades.

## UI

- The in-game HUD is a uGUI canvas inside `Resources/Game.prefab`: Scale With Screen Size, reference **2208×1242** (16:9, iPhone Plus), match width. No safe-area handling, so on current notched or Dynamic Island phones (about 19.5:9) HUD elements at the left and right edges will sit under the sensor housing and rounded corners in landscape.
- Text uses legacy `UnityEngine.UI.Text` with the Arista TTF.
- The world map uses world-space houses plus a card UI; the level title is the literal string "Level N" (`GameData.displayName` is empty for every level).
- `Scenes/World1/UI/GameUI.prefab` is an older, unused copy of the HUD (constant pixel size, 800×600).

## Audio

- Music: eight tracks (theme, map, panic, snow theme, three in-game, level-complete jingle) as 64 kbps MP3 in a folder literally named `mp3_64`, plus two M4A demos. The remaster loads them through per-track prefabs in `Resources/Music` and cross-fades on an `AudioMixer` group.
- Effects: 47 WAVs covering tools (propeller, jetpack, spring, parachute, hammer, magnet, catapult), creature voice (whoops, "arrrgh", cheer, "wheee"), hazards and UI. The remaster wires up only a handful (roll loop, jetpack burn, breakable hit).
- The Unity 4 folder adds two tracks the repo lacks (`kubrik_dark_theme_final1.mp3`, `kubrik_fail_jingle_final1.mp3`, with a `DarkMusic` prefab), a 96 kbps and a VBR encode of in-game track 1, three M4A demos, and 64 more WAV effects (alternates and unused takes). It has no uncompressed music masters, so the 64 kbps files stand unless masters turn up elsewhere.

## Licensing checks before release

- Fonts: Arista, Continuum and **Stencil Std** (an Adobe font) are embedded TTFs. Confirm redistribution rights or replace.
- Sound effects have library-style names (`equipment_switch_12.wav`, `fireworks_rocket_explosion_03.wav`). Confirm the library licence still covers a re-release.
- Facebook and Twitter logos are in the splash art; brand assets and links are out of date.
