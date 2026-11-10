# 02 — Remastered code architecture (`Assets/Remastered/Scripts`)

100 C# files, about 7,600 lines, all in the global namespace and compiled into the default `Assembly-CSharp` (no assembly definitions, no tests). Written against `552afc6`; the last commit (`3e109e3`, now checked out) adds a visual tilt pivot to `Koboto`, wheel-spin animation, and a `ModifyCameraPivot` hook on attachments, but does not change the structure.

## Conventions that matter everywhere

- **The game plays in the YZ plane.** Creatures move along world `Z` (`Vector3.forward`), up is `Y`, and they rotate about world `X` (`Vector3.right`). The game camera sits on the `-X` side of the action looking along `+X`. "Horizontal" in zone code means `transform.forward`.
- **World scale is 0.1× the original.** The level upgrade tool parents an original level under a `Root` scaled to `0.1`. A creature is roughly 1 unit; physics settings (gravity −15, 100 Hz) were tuned for this.
- **Naming trap:** the remaster's `Wheels` is the original `DoubleWheels` (one axle, two wheels), and the remaster's `DoubleWheels` is the original `QuadWheels`. Icons are named `Wheels.png` and `QuadWheels.png`.
- **`Resources.Load` by string** is the asset-loading mechanism: `Game`, `Prefabs/Kobotos/<EKobotoType>`, `Prefabs/Attachments/<EAttachmentType>`, `Music/<track>`, `GameData/GameData`, `Materials/token*`.
- **Singletons and static events** tie the systems together: `AppController.Instance`, `GameManager.Instance`, `InputManager.Instance`, `MusicPlayer.Instance`, `ProgressManager.instance`, `GameEvents` (static), `Koboto.Events` (static), `UIEvents` (static).

## Module map

```
App/         AppController      scene loading (additive), reacts to game states
             ProgressManager    static game data + save file + current level
             GameData           ScriptableObject: worlds -> levels (uid, scenePath, live)
Game/        GameManager        state machine host, UI callbacks
             GameState*         one class per state; GameStateTransition* for timed transitions
             GameEvents         static state-entered / state-exit events + typed game events
             GameEventBus<T>    indexed event bus (used for Koboto.Events)
             KobotoMono         base MonoBehaviour: tracks game state, optional pointer events
             KobotoMonoRigidbody  adds freeze/restore of a Rigidbody on Paused/Map
Koboto/      Koboto             the creature: attachments, forces, tilt PID, death/rescue
             KobotoSensor       raycast probes: ground, ceiling, wheels, air ring, zones
             KobotoParameters   per-prefab tuning values
             KobotoFactory      spawns by EKobotoType from Resources
             KobotoSoundPlayer  roll loop
Attachments/ AttachmentBase + Wheels, DoubleWheels, Spring, Magnet, Propeller, Parachute, Hammer, Jetpack
             Attachments        enum, factory, attachment -> mount-point mapping
Level/       Level              per-scene root: spawns, cameras, music, zones, win/lose queries
             LevelObjectBase    base for interactive objects (state mask, trigger -> OnKobotoEnter)
             LevelObject*       Home, BonusToken, LineAttach, Rotator, Breakable(+Group), JetpackPickup, Fireworks
             Killzone, Hammerable, LineAttachTrigger, MaterialAlphaFade
             LevelZone          rectangular YZ zone; subclasses World, Wind, CameraModifier, CameraForbidden
Camera/      CameraController   registry of named KCams, switch / lerp between them
             KCam (base), GameCam (follow), DragCam (map), SwipeCam (level select), IntroCam, TestCam
PlayerInput/ InputManager + InputModule{Keys,Tilt,Swipe}
UI/          UIGame, UIAttachmentButton, UIJetpackButton, GameStateVisibilty  (in-game HUD)
             WorldMap, LevelSelector                                         (level-select map)
             UIEvents, PointerEventCatcher, UIDrag                           (pointer plumbing)
Music/       MusicPlayer        cross-fading tracks loaded from Resources
Generation/  Connector          procedural curved floor mesh between two platforms
Utils/       KSpline, StraightLine, AbstractLine, PIDController/PDController, SerializableDictionary, Extensions
WorldObjectDefs.cs              C# transliteration of the original definitions file (unused)
```

## Game state machine

`EGameState` is a `[Flags]` enum so that objects can carry a mask: `Unloaded, Transition, Intro, Play, Paused, Map, Lost, Won, LoadNextLevel, ReturnToMenu`.

- `GameManager.Update()` calls the current `GameStateBase.Update(game)`, which returns the state it wants. A different value triggers `TransitionToState`, which fires `GameEvents.OnGameStateExit`, runs a registered `GameStateTransitionBase` coroutine if one exists for that from/to pair, then `SetState`, which fires `GameEvents.OnGameStateEntered`.
- UI buttons and `AppController` do not set state directly; they call `RequestState`, which the current state reads from `game.requestedState` on its next update. The request is cleared every frame.
- `GameStatePlay` decides win/lose by polling `Level.AllKobotosRescued()` / `AnyKobotoDead()`.
- Everything else reacts through `KobotoMono.DidEnterGameState` / `WillExitGameState`. Examples: `Level` switches cameras and music and respawns creatures; `UIGame` shows the right button group; `LevelObjectBase` activates itself when the state matches its `stateMask`; `KobotoMonoRigidbody` freezes and restores velocity around `Paused`/`Map`; `AppController` saves progress on `Won` and loads scenes on `LoadNextLevel` / `ReturnToMenu`.

## Scene and progression flow

- `AppController.TransitionToScene` unloads the current additive scene, loads the next by path (`"Remastered/Scenes/" + scenePath`), makes it active, then requests the end state (`Intro` for levels, `Unloaded` for the map).
- `ProgressManager.Init` loads `Resources/GameData/GameData.asset`, builds `gameProgress[world][level]` from entries flagged `live`, then loads or creates the save file. Per level it stores `unlocked`, `passed`, and three bonus-token booleans, keyed by `levelUID`.
- A level scene is self-describing: its `Level` component lists spawn points with creature type, the available attachments, the music track, and camera references (falling back to the `K_*` tags).

## The creature

`Koboto.FixedUpdate` (while alive and in `Play`):

1. `KobotoMoveForce.Clear()` resets a scratch struct of desired forces, friction, drag, gravity flag, target up-rotation and tilt.
2. `KobotoSensor.UpdateAll()` raycasts: straight down/up, local down/up/forward/back, front and back wheel probes (top and bottom), and a ring of 24 air probes to find the nearest ground and ceiling. It tracks grounded/air time, landing and launch frames, and a short position trail. `UpdateZones()` lets `LevelZone`s inject wind and camera distance.
3. Each attached tool, in a fixed order (`Jetpack, Wheels, Magnet, Spring, Propellor, DoubleWheels, Parachute`), edits the move-force struct in `ModifyMoveForce`.
4. `ProcessMoveForce` fills in defaults the tools did not claim: align to ground when grounded; in the air, align to an approaching ceiling or ground, or apply air steering and tilt from input.
5. Friction is written into the creature's physics material, drag and gravity onto the rigidbody, the force is applied, and a PID controller applies torque about `X` to reach the target tilt.

With no tool attached the creature is a passive box. Tools:

| Tool | Mount | Behaviour in the remaster |
|---|---|---|
| `Wheels` | Wheels | Zero friction; drive force along the wheel contact direction scaled by an acceleration curve up to `groundMoveSpeed`; roll sound |
| `DoubleWheels` | Wheels | As wheels, plus a second pair on top: drives along ceilings and pulls itself toward one when close |
| `Spring` | Bottom | Charges on landing for `onGroundTime`, then sets a bounce velocity along the creature's up vector |
| `Magnet` | Top | Pulls up toward a collider tagged `magnetic` within 12 units; draws a beam with a `LineRenderer` |
| `Propellor` | Top | PD-controlled hover at a target height above ground; dust effect |
| `Parachute` | Top | Opens when falling, closes on ground/ceiling/upward motion; PD-controlled drag; wind zones push it |
| `Hammer` | Front | Rigidbody on a `ConfigurableJoint`, swung by an animator-driven `swing` value; breaks `LevelObjectBreakable` during a timed window |
| `Jetpack` | Jetpack | Always attached when the level offers it; burns for 0.9 s per charge; charges come from `LevelObjectJetpackPickup` |

Each tool also declares whether the creature should use its box or capsule collider.

## Level objects and zones

- `LevelObjectBase` finds a trigger and a solid collider on itself, becomes active when the game state matches `stateMask`, and forwards trigger events as `OnKobotoEnter/Exit` or `OnObjectEnter/Exit`. `DidRestartLevel()` is the reset hook (called when `Play` is entered from anything other than `Paused`/`Map`).
- `LevelZone` is not a collider. It is a rectangle defined by four extents in the object's local YZ plane, tested each physics step against the creature (and against the camera for `LevelZoneWorld` and `LevelZoneCameraForbidden`). `LevelZoneWorld` also provides the bounds outside which a creature is killed as `Lost`.
- `LevelObjectLineAttach` moves a (kinematic) object along an `AbstractLine` (`StraightLine` or `KSpline`) with move/pause phases, ping-pong or cycle. This replaces the original `platform` + `Spline` + `SplineFollow` trio.

## Cameras

`CameraController` owns one real `Camera` and a set of named `KCam` rigs (`Game`, `Map`, `Intro`, `Win` in levels; `Drag`, `Swipe` on the world map). Switching either cuts or lerps the real camera between rig transforms. `GameCam` follows the selected creature with a smoothed position stack, pulls out with speed, tilts when near ceilings, and is pushed out of forbidden zones and back inside the world zone.

## Input

`InputManager.FixedUpdate` sums `Read()` from each enabled `InputModule` into `InputData.move` (−1…1 nominal). `InputModuleKeys`: A/D at ±0.5, Shift doubles. `InputModuleTilt`: `Input.gyro.gravity.x` unscaled. `InputModuleSwipe`: empty. Modules are only enabled inside `#if UNITY_EDITOR`.

## Editor tooling

| Menu | File | Purpose |
|---|---|---|
| `Remastered/UpdateLevel` | `Remastered/Plugins/Editor/UpgradeLevel.cs` | Converts a selected original level: resets layers, re-meshes connectors to 18 points, parents everything under a `Root` scaled 0.1, adds `Level`, fills spawn info from `SpawnPoint` components (always `TreeGuy`) |
| `Connectors/*` | `Remastered/Editor/Scripts/UpdateConnectors.cs` | Rebuild or add `Connector` meshes between two selected platforms |
| Inspectors | `CustomInspector_LevelObject.cs`, `CustomInspector_GameStateVisibility.cs`, `IntroCamEditor.cs`, `BallonCableEditor.cs` | State-mask popups and scene helpers |

`UpgradeLevel` looks for C# `SpawnPoint` and `Connector` components. Original scenes carry the `.js` versions under different script GUIDs, which no longer load, so on an untouched original scene in Unity 2018.2+ the tool finds neither. See the GUID-preserving approach in [07-upgrade-plan.md](07-upgrade-plan.md).

## Strengths to keep

- The state machine plus state-aware base class gives every object a uniform pause/reset/activate story.
- Tools are isolated, data-light classes that compose through one shared force struct — adding the catapult or tuning a tool does not touch the creature.
- Level content is described by the scene itself (`Level` component), and the level list by a ScriptableObject.
- Save data is keyed by stable level UIDs rather than build indices.

## Weaknesses to address

- Global static events with manual subscribe/unsubscribe, plus string-keyed `Resources.Load` and tag lookups.
- No assembly definitions, namespaces or tests; editor code sits under both `Editor/` and `Plugins/Editor/`.
- Per-frame `Debug.Log` calls in gameplay paths.
- Tuning constants are hard-coded inside methods (magnet strength, jetpack thrust, alignment distances).
- Dead files: `NewBehaviourScript1.cs`, `CreateLevelData.cs`, `SpawnPoint.cs` (empty), `WorldObjectDefs.cs`, the unused `GameUI.prefab`.
