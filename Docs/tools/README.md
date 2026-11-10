# Audit scripts

Helpers used to produce the tables in these docs. Python 2.7 or 3, no dependencies. Run from the project root. All of them only read the project, except `gen_level_table.py`, which rewrites the table inside `Docs/04-level-inventory.md`.

| Script | Usage | Output |
|---|---|---|
| `scene_usage.py` | `python Docs/tools/scene_usage.py . <scene or prefab paths...>` | Scripts and prefabs each file references, resolved from `.meta` GUIDs; counts unresolved GUIDs. Set `MODE=compact` to list scripts only |
| `level_manifest.py` | `python Docs/tools/level_manifest.py . <original scene paths...>` | Tools offered (`UIEditor.components`) and creature types (`SpawnPoint.coreType`) per original level |
| `asset_inventory.py` | `python Docs/tools/asset_inventory.py .` | Texture size histogram, shader kinds, file counts and sizes, material-to-shader usage |
| `missing_guids.py` | `python Docs/tools/missing_guids.py Assets Original/KobotoU4/KobotoU4/Assets [subfolder]` | Asset GUIDs referenced by the repo that no `.meta` defines, split into those the Unity 4 copy has and those found nowhere |
| `level_missing_assets.py` | `python Docs/tools/level_missing_assets.py Assets Original/KobotoU4/KobotoU4/Assets` | Per level: unresolved Maya models, other recoverable files, and unknown GUIDs. Contains the 60-level build order (`LEVELS`) taken from the Unity 4 build settings |
| `gen_level_table.py` | `python Docs/tools/gen_level_table.py . Docs/04-level-inventory.md` | Regenerates the 60-level table in doc 04 |

They parse Unity's text-serialised YAML directly, so they work without opening the editor and on scenes whose scripts no longer compile. They cannot read the binary scenes and prefabs in the Unity 4 folder; only its `.meta` files and source files are used.

Use `level_missing_assets.py` to track asset recovery: the "maya" count per level should fall to zero as models are remapped or restored.
