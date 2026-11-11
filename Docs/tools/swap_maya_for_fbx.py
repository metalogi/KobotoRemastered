# -*- coding: utf-8 -*-
# Python 2.7 / 3. In a COPY of the Unity 4 project, replace Maya model files (.mb) that have an
# FBX conversion in the repo with that FBX, keeping the Maya file's .meta (so its GUID and
# sub-asset fileIDs stay the same and existing scene/prefab references keep working).
#
#   python Docs/tools/swap_maya_for_fbx.py <copy project root> <repo Assets/Original/Local Assets/Models> [--apply]
#
# Without --apply it only reports. With --apply, each <name>.mb and <name>.mb.meta is moved to
# <copy root>/_maya_originals/ (same relative path) and replaced by <name>.fbx + <name>.fbx.meta.
#
# Meta edits: Unity 4 named the main Maya take "Take 001 //// <model>"; the FBX importer names it
# "Take 001". The entry for the lowest such clip ID is renamed so the original clip fileID is
# reused. `animationType: 1` (Legacy) is added when absent, because the original scenes play these
# clips through legacy Animation components.
import io, os, re, shutil, sys

ROOT, FBXROOT = sys.argv[1], sys.argv[2]
APPLY = '--apply' in sys.argv
ASSETS = os.path.join(ROOT, 'Assets')
BACKUP = os.path.join(ROOT, '_maya_originals')

MODELS = '''puzzle001B_floor world1_tree02 plant1 world1_tree01 world1_tree03 Cloud2D rollingshell
floorPlain switchup tiltboard Scales switchdown balloonholder puzzle001_floor spikes physics_wedge
World1Waterplane genericLandPiece sadcloud w1_bgTree2 poyo snowTree stomper rampbird
token world1_house world3_house world2_house butterfly treeguy falltree owlFace sky1'''.split()

entry_re = re.compile(r'^    (\d+): (.*?)\s*$', re.M)

def table(meta_text):
    block = meta_text.split('fileIDToRecycleName:', 1)
    if len(block) < 2:
        return {}
    body = re.split(r'\n  \w', block[1], 1)[0]
    return dict((int(a), b) for a, b in entry_re.findall(body))

def find_files(root, exts):
    out = {}
    for d, _, fs in os.walk(root):
        for f in fs:
            stem, ext = os.path.splitext(f)
            if ext.lower() in exts:
                out.setdefault(stem.lower(), []).append(os.path.join(d, f))
    return out

mb_files = find_files(ASSETS, ('.mb',))
fbx_files = find_files(FBXROOT, ('.fbx',))

problems = 0
for name in MODELS:
    key = name.lower()
    mbs = mb_files.get(key, [])
    fbxs = fbx_files.get(key + '_fbx', []) or fbx_files.get(key, [])
    if len(mbs) != 1 or len(fbxs) != 1:
        print('SKIP %-18s mb=%d fbx=%d' % (name, len(mbs), len(fbxs)))
        problems += 1
        continue
    mb, fbx = mbs[0], fbxs[0]
    mb_meta = io.open(mb + '.meta', 'r', encoding='utf-8', newline='').read()
    fbx_names = set(table(io.open(fbx + '.meta', 'r', encoding='utf-8').read()).values())
    mb_tab = table(mb_meta)

    new_meta = mb_meta
    notes = []
    # rename the main take
    takes = sorted(i for i, n in mb_tab.items() if i // 100000 == 74 and n.startswith('Take 001 ////'))
    if takes and 'Take 001' in fbx_names and 'Take 001' not in mb_tab.values():
        i = takes[0]
        new_meta = re.sub(r'^(    %d: ).*$' % i, r'\g<1>Take 001', new_meta, count=1, flags=re.M)
        notes.append('clip %d "%s" -> "Take 001"' % (i, mb_tab[i]))
        mb_tab[i] = 'Take 001'
    # anything the FBX will not produce
    lost = ['%d %s' % (i, n) for i, n in sorted(mb_tab.items())
            if i // 100000 in (43, 74) and n not in fbx_names]
    if lost:
        notes.append('NOT IN FBX: ' + '; '.join(lost))
    if 'animationType:' not in new_meta:
        nl = '\r\n' if '\r\n' in new_meta else '\n'
        new_meta = new_meta.rstrip('\r\n') + nl + '  animationType: 1' + nl
        notes.append('animationType: 1 added')

    target = os.path.splitext(mb)[0] + '.fbx'
    if os.path.exists(target) or os.path.exists(target + '.meta'):
        print('SKIP %-18s %s already exists' % (name, os.path.relpath(target, ROOT)))
        problems += 1
        continue
    print('%-6s %-18s %s <- %s' % ('SWAP' if APPLY else 'plan', name, os.path.relpath(target, ROOT), os.path.basename(fbx)))
    for n in notes:
        print('         ' + n)
    if APPLY:
        rel = os.path.relpath(mb, ROOT)
        dest = os.path.join(BACKUP, rel)
        if not os.path.isdir(os.path.dirname(dest)):
            os.makedirs(os.path.dirname(dest))
        shutil.move(mb, dest)
        shutil.move(mb + '.meta', dest + '.meta')
        shutil.copyfile(fbx, target)
        io.open(target + '.meta', 'w', encoding='utf-8', newline='').write(new_meta)

print('\n%d models, %d skipped%s' % (len(MODELS), problems, '' if APPLY else ' (dry run; add --apply)'))
