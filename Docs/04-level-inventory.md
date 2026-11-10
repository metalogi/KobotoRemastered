# 04 — Level inventory

## Scope: 60 levels

The game shipped with **60 levels**: three worlds of 20. The order below is the build order from the Unity 4 project's `ProjectSettings/EditorBuildSettings.asset` (build indices 6–65), which agrees with `WorldObjectDefs.js` everywhere except World 1 slot 10. That slot is `3-Ed/reflectionTest.unity`; the definitions file names a `World01_Level10.unity` that never existed.

All 60 scene files are in the repo under `Assets/Original/Scenes`. 10 are ported, 50 remain.

## What is ported today

| Remastered scene | From | In `GameData` | In build settings | Notes |
|---|---|---|---|---|
| `World1/Level01` – `Level07` | `World01_Level01` – `07` | Yes | Yes | |
| `World1/level08` | `World01_Level08` | Yes (as `World1/Level08` — file name case differs) | **No** | |
| `World1/Level09` | `World01_Level09` | Yes | **No** | Original creature was `Rushton-Blue`; remaster spawns `TreeGuy` |
| `World1/Level10` | `3-Ed/reflectionTest` | Yes | **No** | Boat and Windmill prefabs are present without their original scripts; `LevelZoneWind` zones provide the wind |
| `World1/EasyJet` | `3-Ed/easyJet` (World 1 slot 11) | No | No | Jetpack test bed. Original starts with 4 charges; remaster has no way to set a starting count |
| `World1/hammersetup` | Appears to be a copy of Level06 (same content) | No | No | Hammer rig test scene |

Tools offered match the original for levels 1–10 (checked by decoding `availableAttachments` against `UIEditor.components[]`).

All ported scenes still contain the original `.js` components as missing scripts, and reference `Assets/Original` prefabs, materials and models directly. Most also contain mesh references to Maya files that are not in the repo (see doc 08).

Two original scenes in the repo were edited in place during early remaster work and are no longer clean copies: `Levels/World1/World01_Level03.unity` and `3-Ed/reflectionTest.unity` both carry remastered C# components, and `reflectionTest` has lost some original ones (its `EndGate`, for example). The untouched versions are in the Unity 4 project folder, in binary format.

## The 60 levels

Generated from the repo's scene files by script. "Tools offered" is the level's `UIEditor.components[]` (prefab name, with count where it is not 1; jetpack counts are starting charges). "Kobotos" is each `SpawnPoint.coreType`. "Level-specific scripts" lists original `.js` components present in the scene beyond the ones nearly every level has (managers, spawn point, end gate, bonus tokens, connectors, clouds, reset/pause helpers, scenery). `fireworks.js` and `Button.js` do not appear because those two scripts are missing from the repo (doc 08).

Remember the naming swap: original `DoubleWheels` = remastered `Wheels`; original `QuadWheels` = remastered `DoubleWheels`.

| # | World | Slot | Original scene (under `Assets/Original/Scenes/`) | Tools offered | Kobotos | Level-specific scripts | Remastered scene |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | `Levels/World1/World01_Level01` | DoubleWheels | TreeGuy | - | Level01 |
| 2 | 1 | 2 | `Levels/World1/World01_Level02` | DoubleWheels | TreeGuy | platform, SpeedRamp, Spline, SplineFollow, TriggerSpline | Level02 |
| 3 | 1 | 3 | `Levels/World1/World01_Level03` | DoubleWheels, Magnet | TreeGuy | CameraOffsetZone, DeathZone, platform, Spline, SplineFollow, TriggerSpline, TutTrigger | Level03 |
| 4 | 1 | 4 | `Levels/World1/World01_Level04` | Propellor | TreeGuy | CameraOffsetZone, TutTrigger | Level04 |
| 5 | 1 | 5 | `Levels/World1/World01_Level05` | DoubleWheels, Magnet, Propellor | TreeGuy | platform, Spline, SplineFollow | Level05 |
| 6 | 1 | 6 | `Levels/World1/World01_Level06` | DoubleWheels, Hammer | TreeGuy | BreakableWall, CameraOffsetZone, PhysicsBlock, RigLocker, ShatterBlast | Level06 |
| 7 | 1 | 7 | `Levels/World1/World01_Level07` | DoubleWheels, Propellor | TreeGuy | CameraOffsetZone, DeathZone, ForbiddenZone, platform, rotateZ, Spline, SplineFollow | Level07 |
| 8 | 1 | 8 | `Levels/World1/World01_Level08` | QuadWheels | TreeGuy | ForbiddenZone | level08 |
| 9 | 1 | 9 | `Levels/World1/World01_Level09` | Spring | Rushton-Blue | CameraOffsetZone | Level09 |
| 10 | 1 | 10 | `3-Ed/reflectionTest` | DoubleWheels, Parachute | TreeGuy | Addon, BlockCamera, CameraOffsetZone, Physics_return, platform, ReflectionManager, Spline, SplineFollow | Level10 |
| 11 | 1 | 11 | `3-Ed/easyJet` | DoubleWheels, JetPack x4 | Rushton-Blue | Addon, PickUpComponent | EasyJet (partial, not in GameData) |
| 12 | 1 | 12 | `3-Ed/springEasy` | DoubleWheels, Spring, Magnet | Rushton-Blue | CameraOffsetZone, DeathZone, platform, Spline, SplineFollow, Stomper, TriggerSpline | - |
| 13 | 1 | 13 | `3-Ed/JetPackTut` | DoubleWheels, JetPack x2, Parachute | TreeGuy | Addon, Interest, PickUpComponent | - |
| 14 | 1 | 14 | `3-Ed/badCloud1` | QuadWheels, Spring | Rushton-Yellow | Addon, CameraOffsetZone, Chase, DeathZone, Spline, SplineFollow | - |
| 15 | 1 | 15 | `3-Ed/propPlat` | Propellor, Magnet, Parachute | TreeGuy | Addon, DeathZone, Interest, Jetstream, rotateZ, Spline, SplineFollow | - |
| 16 | 1 | 16 | `3-Ed/springMag` | DoubleWheels, Spring, Magnet | Rushton-Blue | CameraOffsetZone, Interest, platform, Spline, SplineFollow, TriggerSpline | - |
| 17 | 1 | 17 | `3-Ed/2_Tutorial0` | DoubleWheels x2 | Rushton-Blue, Rushton-Yellow | Addon | - |
| 18 | 1 | 18 | `3-Ed/2_Tutorial` | DoubleWheels x2 | Rushton-Blue, Rushton-Yellow | Addon, DeathZone, Door, RuntimeConnector | - |
| 19 | 1 | 19 | `3-Ed/easyCatapult` | DoubleWheels x2, Catapult | Fisheye, TreeGuy | CameraOffsetZone, DoorRB, MountPoint, platform | - |
| 20 | 1 | 20 | `3-Ed/easySpringMag` | Magnet, Spring | Rushton-Blue | CameraOffsetZone, DeathZone, SinY, Spline, SplineFollow | - |
| 21 | 2 | 1 | `3-Ed/easy_SpringWheels` | DoubleWheels, Spring | Rushton-Blue | CameraOffsetZone, DeathZone, ForbiddenZone, LookAtPlayer, rotateZ, Stomper | - |
| 22 | 2 | 2 | `3-Ed/easy_snow` | QuadWheels, JetPack x0, Parachute | Rushton-Yellow | CameraOffsetZone, DeathZone, LookAtPlayer, PickUpComponent | - |
| 23 | 2 | 3 | `3-Ed/SnowScaleSimple` | DoubleWheels, Spring | Rushton-Yellow | ArtificalGravity, blockPlatform, CameraOffsetZone, DeathZone, EyeScales, Interest, NoCritterCollision, NoWorldCollision, Physics_LockPosition, PhysicsBlock, positionConstraint, RigLocker, rotationConstaint | - |
| 24 | 2 | 4 | `3-Ed/mah` | QuadWheels, Magnet | Rushton-Yellow | MagnoProp, NoWorldCollision, RigLocker | - |
| 25 | 2 | 5 | `3-Ed/cave` | QuadWheels, JetPack x0 | Rushton-Blue | Addon, Anger, CameraOffsetZone, DeathZone, Interest, PickUpComponent, Spline, Stomper | - |
| 26 | 2 | 6 | `3-Ed/movables` | QuadWheels, Magnet, Spring | Rushton-Yellow | ArtificalGravity, BreakableWall, Interest, LookAtPlayer, MagnoProp, NoWorldCollision, PhysicsBlock, RigLocker, rollingShell | - |
| 27 | 2 | 7 | `3-Ed/jetPack_IceMonsta2` | DoubleWheels, JetPack x99, Magnet | TreeGuy | BlockCamera, CameraOffsetZone, Chase2, DeathZone, rotateZ, Spline, SplineFollow, TriggerSpline | - |
| 28 | 2 | 8 | `3-Ed/easy_wheelsProp2` | DoubleWheels, Propellor | Rushton-Blue | CameraOffsetZone, DeathZone, rotateZ | - |
| 29 | 2 | 9 | `3-Ed/ed_013` | DoubleWheels x2 | TreeGuy, Rushton-Blue | ArtificalGravity, DeathZone, IgnoreCollisions, Interest, InterestingObject, Jetstream, PhysicsBlock, RigLocker, rollingShell, rotateZ, RuntimeConnector, ShatterBlast, tipOver | - |
| 30 | 2 | 10 | `3-Ed/coulpling` | Magnet, QuadWheels, DoubleWheels | Rushton-Yellow, Rushton-Blue | CameraOffsetZone, LookAtPlayer | - |
| 31 | 2 | 11 | `3-Ed/probMagfixed` | Magnet, Propellor, DoubleWheels | Fisheye, TreeGuy | CameraOffsetZone, DeathZone, Stomper, TriggerMultiple | - |
| 32 | 2 | 12 | `3-Ed/floatingScales` | DoubleWheels, Spring | Rushton-Yellow | blockPlatform, DeathZone, EyeScales, Interest, NoCritterCollision, NoWorldCollision, Physics_LockPosition, PhysicsBlock, positionConstraint, rotateZ, rotationConstaint | - |
| 33 | 2 | 13 | `3-Ed/mediumSpringMag` | Magnet, Spring | Rushton-Blue | CameraOffsetZone, DeathZone, ReflectionManager, SinY, Spline, SplineFollow | - |
| 34 | 2 | 14 | `3-Ed/badCloudFree` | QuadWheels, JetPack, Spring | Rushton-Yellow | Chase2, DeathZone, PickUpComponent | - |
| 35 | 2 | 15 | `3-Ed/introducingQuadWheels0` | DoubleWheels, QuadWheels, Catapult | TreeGuy, Fisheye | ArtificalGravity, Falltree, IgnoreCollisions, Interest, NoWorldCollision, PhysicsBlock, PhysicsEnabler, RigLocker, rollingShell, ShatterBlast | - |
| 36 | 2 | 16 | `3-Ed/snowScales` | QuadWheels, Spring | Rushton-Yellow | Anger, blockPlatform, CameraOffsetZone, DeathZone, DoorRB, EyeScales, ForbiddenZone, IgnoreCollisions, Interest, NoCritterCollision, NoWorldCollision, Physics_LockPosition, PhysicsBlock, platform, positionConstraint, RigLocker, rotateZ, rotationConstaint, Spline, SplineFollow | - |
| 37 | 2 | 17 | `3-Ed/snow1` | DoubleWheels, JetPack x2, Parachute | Rushton-Yellow | CameraOffsetZone, DeathZone, Jetstream, PickUpComponent, rotateZ, Spline | - |
| 38 | 2 | 18 | `3-Ed/movables2` | QuadWheels, Magnet, Spring | tvBunny-Blue, tvBunny-Yellow | ArtificalGravity, BreakableWall, Interest, MagnoProp, NoWorldCollision, PhysicsBlock, RigLocker, rollingShell | - |
| 39 | 2 | 19 | `3-Ed/chase_slope` | DoubleWheels, JetPack x0, Hammer | Rushton-Yellow | CameraOffsetZone, Chase, DeathZone, ForbiddenZone, Interest, LookAtPlayer, PickUpComponent, SetChaseSpeed, ShatterBlast, Spline, SplineFollow | - |
| 40 | 2 | 20 | `3-Ed/snowScalePoyo` | DoubleWheels, JetPack x2, Parachute x2 | Poyo, TreeGuy | ArtificalGravity, CameraOffsetZone, DeathZone, EyeScales, Interest, NoCritterCollision, NoWorldCollision, Physics_LockPosition, PhysicsBlock, PickUpComponent, positionConstraint, RigLocker, rotationConstaint | - |
| 41 | 3 | 1 | `3-Ed/W3_00A` | QuadWheels, JetPack x2 | Rushton-Blue | CameraOffsetZone, DeathZone, PickUpComponent | - |
| 42 | 3 | 2 | `3-Ed/W3_000` | DoubleWheels, JetPack x0, Parachute | Rushton-Blue | CameraOffsetZone, Interest, PickUpComponent, RigLocker, rollingShell, ShatterBlast, Spline, SplineFollow | - |
| 43 | 3 | 3 | `3-Ed/W3_01` | QuadWheels, JetPack x0, Parachute x2 | Rushton-Blue | DeathZone, Interest, Jetstream, PickUpComponent, Spline, SplineFollow | - |
| 44 | 3 | 4 | `3-Ed/barrier` | DoubleWheels, JetPack x2 | Rushton-Blue | ArtificalGravity, DeathZone, ForbiddenZone, Interest, PhysicsBlock, RigLocker, RollSound, SpikeyRoller | - |
| 45 | 3 | 5 | `3-Ed/W3_shoeHelper` | DoubleWheels, Spring | ShoeBox, Rushton-Blue | ArtificalGravity, Interest, PhysicsBlock, RigLocker, Switch | - |
| 46 | 3 | 6 | `3-Ed/W3_para` | Parachute, JetPack x4 | Fisheye | DeathZone, PickUpComponent, rotateZ, Spline, SplineFollow | - |
| 47 | 3 | 7 | `3-Ed/spikyRollHammer` | DoubleWheels, JetPack x0, Hammer | Rushton-Blue | ArtificalGravity, DeathZone, ForbiddenZone, Interest, PhysicsBlock, PickUpComponent, RigLocker, RollSound, ShatterBlast, SpikeyRoller | - |
| 48 | 3 | 8 | `3-Ed/catapiller` | QuadWheels | Rushton-Blue | ArtificalGravity, CameraOffsetZone, Caterpiller, CaterpillerControl, CaterpillerFood, DeathZone, ForbiddenZone, Interest, RigLocker, TriggerT | - |
| 49 | 3 | 9 | `3-Ed/catapiller2` | DoubleWheels, JetPack x0, Hammer, Parachute | Rushton-Blue | ArtificalGravity, CameraOffsetZone, Caterpiller, CaterpillerControl, CaterpillerFood, DeathZone, ForbiddenZone, Interest, PickUpComponent, RigLocker, ShatterBlast, TriggerT | - |
| 50 | 3 | 10 | `3-Ed/spikyRollJetPacks` | QuadWheels, JetPack x0, Parachute | tvBunny-Blue | DeathZone, Interest, PickUpComponent, Spline, SplineFollow | - |
| 51 | 3 | 11 | `3-Ed/spikyRollSwitches` | QuadWheels, Propellor, Hammer | Rushton-Blue | ArtificalGravity, CameraOffsetZone, DeathZone, Interest, PhysicsBlock, RigLocker, RollSound, ShatterBlast, SpikeyRoller, Spline, Switch | - |
| 52 | 3 | 12 | `3-Ed/W3_chase` | DoubleWheels, JetPack x0, Hammer | tvBunny-Blue | ArtificalGravity, Chase, DeathZone, Interest, PhysicsBlock, PickUpComponent, RigLocker, RollSound, ShatterBlast, SpikeyRoller, Spline, SplineFollow, Switch, TriggerSpline | - |
| 53 | 3 | 13 | `3-Ed/W3_chase2` | DoubleWheels, JetPack x0, Hammer, Parachute | tvBunny-Blue | CameraOffsetZone, Chase, DeathZone, ForbiddenZone, Interest, PickUpComponent, ShatterBlast, Spline, SplineFollow, TriggerSpline | - |
| 54 | 3 | 14 | `3-Ed/W3_prop` | Propellor, Magnet, Parachute | Rushton-Blue | DeathZone, Interest, rotateZ, Spline, SplineFollow, Windmill | - |
| 55 | 3 | 15 | `3-Ed/dominos` | QuadWheels, Magnet, Spring | Rushton-Yellow | ArtificalGravity, CameraOffsetZone, DeathZone, DominoControl, ForbiddenZone, Interest, MagnoProp, RigLocker, rollingShell, ShatterBlast, Spline, SplineFollow, TriggerSpline | - |
| 56 | 3 | 16 | `3-Ed/stompas` | DoubleWheels, JetPack x2 | Rushton-Blue | DeathZone, Interest, PickUpComponent, Stomper | - |
| 57 | 3 | 17 | `3-Ed/cacterpiller3` | QuadWheels, JetPack x25, Hammer | Rushton-Blue | ArtificalGravity, CameraOffsetZone, Caterpiller, CaterpillerControl, CaterpillerFood, DeathZone, Interest, RigLocker, Switch, TriggerT | - |
| 58 | 3 | 18 | `3-Ed/ed_003` | Spring, Hammer, DoubleWheels | ShoeBox, Rushton-Blue | AnimatedObject, DeathZone, Floaty, Interest, Jetstream, ShatterBlast | - |
| 59 | 3 | 19 | `3-Ed/huntForJetPacks` | Propellor, JetPack x0, Magnet | Fisheye | CameraOffsetZone, DeathZone, PickUpComponent, Spline, SplineFollow | - |
| 60 | 3 | 20 | `3-Ed/ed_010_W3_v2` | DoubleWheels, Propellor, Parachute | Rushton-Blue | ArtificalGravity, BreakableWall, ForbiddenZone, Interest, Jetstream, NoWorldCollision, PhysicsBlock, RigLocker, rollingShell, Switch | - |

Per-level lists of models each scene references but the repo cannot resolve come from `tools/level_missing_assets.py`.

## Mechanics backlog

How many of the 60 level scenes use each original script, and what exists for it in the remaster. This is the work list for restoring levels, ordered by reach.

### Present in nearly every level

| Original | Scenes | Remastered | Status |
|---|---|---|---|
| `SpawnPoint` | 60 | `Level.kobotoSpawnInfo` | Done, but creature type is always `TreeGuy` and "start with tool" is not supported |
| `EndGate` (house) + `fireworks` | 58–59 | `LevelObjectHome`, `LevelObjectFireworks` | Done for one creature; occupancy for multi-creature levels is not |
| `BonusToken` | 59 | `LevelObjectBonusToken` | Done; fixed at three per level, index set by hand, save lookup has a bug |
| `CameraManager` + `ZoneOfInterest` | 60 | `GameCam`, `IntroCam`, `DragCam` | Follow, intro, map cameras done; interest zones not |
| `UIEditor` / `UIManager` / `GenericFunctions` | 60 | `UIGame`, `GameManager` | Done |
| `Tutorial2` | 58 | — | Not ported. Steps are configured in many levels; needs a pass to list them all |
| `GeneralReset`, `PauseAction` | 60, 59 | `LevelObjectBase.DidRestartLevel`, state mask | Covered by design; each ported object must implement reset |
| `Connector` + `CurvedSurface` | 46 | `Generation/Connector.cs` | Mesh generator ported; baked meshes in scenes still work |
| `Cloud`, `cable`, `butterfly` | 39, 3, 20 | — | Scenery animation, not ported (`butterfly` is World 3 only) |

### Gameplay objects

| Original | Scenes | What it is | Remastered | Status |
|---|---|---|---|---|
| `DeathZone` | 39 | Kills on touch (spikes etc.) | `Killzone` | Done (impale, drown). `Squashed` and `Lost` have no reaction |
| `CameraOffsetZone` | 33 | Camera pull-back / offset | `LevelZoneCameraModifier` | Distance only |
| `Interest`, `InterestingObject` | 30, 1 | Camera looks toward a point of interest | — | Missing |
| `Spline`, `SplineFollow`, `platform`, `TriggerSpline` | 26, 23, 9, 8 | Moving platforms and anything on rails, optionally trigger-started | `KSpline`, `LevelObjectLineAttach`, `LineAttachTrigger` | Done for platforms; verify trigger and carry-the-creature behaviour |
| `RigLocker`, `PhysicsBlock`, `ArtificalGravity`, `Physics_LockPosition`, `PhysicsEnabler`, `Physics_return`, `position/rotationConstraint` | 20, 15, 16, 4, 1, 1, 4 | Loose physics props constrained to the play plane, with custom gravity | — | Missing as a general system; `LevelObjectBreakable` covers the Level06 case |
| `PickUpComponent` | 19 | Jetpack charge pickup | `LevelObjectJetpackPickup` | Done |
| `ForbiddenZone`, `BlockCamera` | 12, 2 | Camera exclusion | `LevelZoneCameraForbidden` | Done |
| `ShatterBlast`, `BreakableWall` | 12, 4 | Hammer / impact destruction | `LevelObjectBreakable`, `LevelObjectBreakableGroup`, `Hammerable` | Done for walls; shatter effect to verify |
| `rotateZ` | 11 | Constant rotation | `LevelObjectRotator` | Done |
| `NoWorldCollision`, `NoCritterCollision`, `IgnoreCollisions` | 9, 4, 3 | Collision filtering | — | Missing; needs physics layers (the original had `CritterCore` and `Component` layers but an all-on collision matrix, so filtering was done in script) |
| `Addon` (in scene) | 8 | A tool pre-attached or lying in the level | — | Missing |
| `rollingShell` | 7 | Rolling shell prop | — | Missing |
| `Jetstream`, `Windmill` | 6, 1 | Wind | `LevelZoneWind` | Done for parachute; check propeller interaction against original |
| `Button` | 6 | Push button (script missing from repo, present in the Unity 4 folder) | — | Missing |
| `Switch`, `Door`, `DoorRB`, `TriggerMultiple`, `TriggerT` | 5, 1, 2, 1, 3 | Switches opening doors / firing triggers | — | Missing |
| `Stomper` | 5 | Crushing piston | — | Missing (needs `Squashed` death) |
| `LookAtPlayer`, `Anger` | 5, 2 | Reactive scenery / enemies | — | Missing |
| `EyeScales`, `blockPlatform` | 4, 3 | Balance scales | — | Missing |
| `SpikeyRoller`, `RollSound` | 4 | Rolling spike hazard | — | Missing |
| `MagnoProp` | 4 | Magnetic prop the magnet can lift | — | Missing |
| `Chase`, `Chase2`, `SetChaseSpeed` | 4, 2, 1 | Pursuer ("bad cloud", ice monster) | — | Missing |
| `Caterpiller`, `CaterpillerControl`, `CaterpillerFood` | 3 | Caterpillar creature and its food | — | Missing; its model has no FBX in the repo |
| `ReflectionManager` | 2 | Planar reflection | — | Missing |
| `RuntimeConnector` | 2 | Floor that reshapes at runtime | — | Missing |
| `SinY` | 2 | Bobbing motion | — | Missing (trivial) |
| `DominoControl`, `Falltree`, `tipOver`, `Floaty`, `AnimatedObject`, `SpeedRamp`, `MountPoint` (in scene) | 1 each | One-off set pieces | — | Missing |

### Tools and creatures by reach

Counted over the 60 level scenes.

| Tool | Scenes offering it | Remastered |
|---|---|---|
| DoubleWheels (2 wheels) | 36 | `Wheels` |
| JetPack | 22 | `Jetpack` (no starting count) |
| QuadWheels | 18 | `DoubleWheels` |
| Spring | 16 | `Spring` |
| Magnet | 16 | `Magnet` |
| Parachute | 14 | `Parachute` |
| Propellor | 10 | `Propellor` |
| Hammer | 9 | `Hammer` |
| Catapult | 2 (World 1 slot 19, World 2 slot 15) | **Missing** |

| Creature | Scenes | Remastered |
|---|---|---|
| Rushton-Blue | 27 | Missing |
| TreeGuy | 17 | `TreeGuy` |
| Rushton-Yellow | 14 | Missing |
| Fisheye | 5 | Missing |
| tvBunny-Blue | 4 | Missing |
| ShoeBox | 2 | Missing |
| tvBunny-Yellow, Poyo | 1 each | Missing |

48 of the 60 levels need a creature other than TreeGuy.

Two-creature levels (11): World 1 slots 17, 18, 19; World 2 slots 9, 10, 11, 15, 18, 20; World 3 slots 5, 18.

## Other original scenes

`Assets/Original/Scenes` holds 199 scenes; 60 are levels and 6 are front end. The rest are test beds and unused designs: `0-karim/` (9), `1-jade/` (30), `2-Jo/` (4), and about 75 more in `3-Ed/`. They are not needed for the restoration.
