# Kubrik — project documentation

Written 2026-11-09 and revised 2026-11-10 from an audit of the repository (code, scenes, assets, git history, the Unity 2019.1 editor log) and of the local Unity 4 project copy in `/Original`. The only changes made to the project were fast-forwarding the branch and adding a `.gitignore`; nothing in `Assets/`, `Packages/` or `ProjectSettings/` was edited. The game was **not play-tested**, so runtime behaviour described here comes from reading code and scene data unless stated otherwise.

| Doc | Contents |
|---|---|
| [01-current-state.md](01-current-state.md) | Repository, Unity version, folder layout, settings, what runs today |
| [02-remastered-architecture.md](02-remastered-architecture.md) | How the 2017–2019 C# rewrite (`Assets/Remastered`) is structured |
| [03-original-game-reference.md](03-original-game-reference.md) | The Unity 4 original: flow, scripts, settings, how to mine it |
| [04-level-inventory.md](04-level-inventory.md) | All 60 levels: source scene, tools, creatures, mechanics, port status |
| [05-assets-and-rendering.md](05-assets-and-rendering.md) | Textures, models, shaders, audio, UI — sizes and condition |
| [06-known-issues.md](06-known-issues.md) | Bugs and broken functionality found, with file references |
| [07-upgrade-plan.md](07-upgrade-plan.md) | Phased plan to reach Unity 6, 60 levels, modern code, modern iOS |
| [08-unity4-project-folder.md](08-unity4-project-folder.md) | What the local Unity 4 project copy contains and what can be recovered from it |
| [tools/](tools/README.md) | The read-only Python scripts that produced the scene, level and asset tables |

## Headline findings

1. **The project opens and compiles in Unity 2019.1.10f1** with warnings only (editor log, 2026-11-09, taken one commit before the current HEAD). One shader (`MetalRef`) fails to compile. The branch `unity2019-upgrade` now sits at the newest commit, `3e109e3`.
2. **Two codebases live side by side.** `Assets/Original` is the Unity 4 game: 187 UnityScript (`.js`) files that no longer compile in any Unity since 2018.2, plus the art, prefabs and 199 scenes. `Assets/Remastered` is a C# rewrite (100 scripts, ~7,600 lines) that reuses the original art and scene geometry. The remastered level scenes are the original scenes with new C# components added and the old `.js` components left behind as missing scripts.
3. **The game is 60 levels** — three worlds of 20. All 60 scenes are in the repo; 10 are ported, 50 remain.
4. **Only seven of the ten ported levels are in the build settings**, and several code paths would stop a real device build from being playable: tilt/keyboard input is only enabled inside `#if UNITY_EDITOR`, and level-completion bookkeeping throws on the last level of a world.
5. **Most original mechanics are not ported yet.** Present: wheels, quad wheels, spring, magnet, propeller, parachute, hammer, jetpack, kill zones, moving platforms, breakables, wind, bonus tokens. Missing: catapult, every creature except TreeGuy (48 levels need another), multi-creature levels, stompers, chasers, switches/doors, scales, caterpillars, dominoes, tutorials, world select, worlds 2 and 3, trophy room, most sound effects.
6. **The repo is missing assets the levels depend on.** The Maya model files were never committed, and every level scene points at them: about 2,050 mesh and 640 animation references are unresolved across the original `Levels` and `3-Ed` scene folders (145 scenes, which include all 60 levels). Eight physics materials and two scripts are missing as well. Most of this is recoverable from the Unity 4 folder; 13 models have no FBX anywhere and, with no Maya available, must be extracted from the old build data or import cache ([08](08-unity4-project-folder.md)).
7. **The original game runs again, in Unity 5.6.** Unity 4.2 can no longer be activated, but a copy of the original project (original scripts and settings, 33 Maya models swapped for FBX) compiles and plays in Unity 5.6.7f1. Its physics engine is newer than 4.2's, so it is a close reference rather than an exact one ([03](03-original-game-reference.md#reference-build)).
8. **The remaster's physics differ from the original's.** Original: gravity −90.81 at 10× scale (−9.08 at the remaster's scale), 25 Hz. Remaster: −15, 100 Hz. Objects fall about 29% faster than in the original.
9. **Art is sized for 2010-era phones and there are no higher-resolution 2D sources.** 258 of 281 readable textures are 512 px or smaller, none exceeds 1024 (2048 for one UI atlas in the Unity 4 folder); all 40 custom shaders are fixed-function ShaderLab; music is 64 kbps MP3.
10. **iOS builds need a Mac.** This machine is Windows 10; Unity can generate the Xcode project here but it has to be built and signed on macOS (or a cloud Mac build service).
