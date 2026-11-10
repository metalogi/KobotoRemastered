# -*- coding: utf-8 -*-
# Python 2.7 / 3. For each of the 60 shipped levels (Unity 4 build order), list asset GUIDs the level
# scene references that the repo cannot resolve, split into: Maya models present in the Unity 4 copy,
# other files present in the Unity 4 copy, and GUIDs found nowhere.
# Usage: python Docs/tools/level_missing_assets.py <repo Assets dir> <Unity 4 Assets dir>
import os, re, sys, io
from collections import Counter

ASSETS, OTHER = sys.argv[1], sys.argv[2]
guid_re = re.compile(r'^guid:\s*([0-9a-f]{32})', re.M)
ref_re = re.compile(r'guid:\s*([0-9a-f]{32})')

def metas(root):
    out = {}
    for d, _, fs in os.walk(root):
        for f in fs:
            if f.endswith('.meta'):
                p = os.path.join(d, f)
                t = io.open(p, 'r', encoding='latin-1').read(600)
                m = guid_re.search(t)
                if m:
                    out[m.group(1)] = os.path.relpath(p[:-5], root).replace(os.sep, '/')
    return out

mine, other = metas(ASSETS), metas(OTHER)

# Build order taken from the Unity 4 project's EditorBuildSettings.asset (indices 6-65).
LEVELS = '''Levels/World1/World01_Level01 Levels/World1/World01_Level02 Levels/World1/World01_Level03
Levels/World1/World01_Level04 Levels/World1/World01_Level05 Levels/World1/World01_Level06
Levels/World1/World01_Level07 Levels/World1/World01_Level08 Levels/World1/World01_Level09
3-Ed/reflectionTest 3-Ed/easyJet 3-Ed/springEasy 3-Ed/JetPackTut 3-Ed/badCloud1 3-Ed/propPlat
3-Ed/springMag 3-Ed/2_Tutorial0 3-Ed/2_Tutorial 3-Ed/easyCatapult 3-Ed/easySpringMag
3-Ed/easy_SpringWheels 3-Ed/easy_snow 3-Ed/SnowScaleSimple 3-Ed/mah 3-Ed/cave 3-Ed/movables
3-Ed/jetPack_IceMonsta2 3-Ed/easy_wheelsProp2 3-Ed/ed_013 3-Ed/coulpling 3-Ed/probMagfixed
3-Ed/floatingScales 3-Ed/mediumSpringMag 3-Ed/badCloudFree 3-Ed/introducingQuadWheels0
3-Ed/snowScales 3-Ed/snow1 3-Ed/movables2 3-Ed/chase_slope 3-Ed/snowScalePoyo
3-Ed/W3_00A 3-Ed/W3_000 3-Ed/W3_01 3-Ed/barrier 3-Ed/W3_shoeHelper 3-Ed/W3_para
3-Ed/spikyRollHammer 3-Ed/catapiller 3-Ed/catapiller2 3-Ed/spikyRollJetPacks
3-Ed/spikyRollSwitches 3-Ed/W3_chase 3-Ed/W3_chase2 3-Ed/W3_prop 3-Ed/dominos 3-Ed/stompas
3-Ed/cacterpiller3 3-Ed/ed_003 3-Ed/huntForJetPacks 3-Ed/ed_010_W3_v2'''.split()

BUILTIN = ('0000000000000000', 'f70555f144d8491a825f0804e09c671c', 'f5f67c52d1564df4a8936ccd202a3bd8')
MAYA = ('.mb', '.ma')
mb_used, other_used, lost = Counter(), Counter(), Counter()
rows = []
for i, l in enumerate(LEVELS):
    p = os.path.join(ASSETS, 'Original', 'Scenes', l + '.unity')
    txt = io.open(p, 'r', encoding='latin-1').read()
    gs = set(g for g in ref_re.findall(txt) if g not in mine and not g.startswith(BUILTIN))
    mb = sorted(os.path.basename(other[g]) for g in gs if g in other and other[g].lower().endswith(MAYA))
    oth = sorted(os.path.basename(other[g]) for g in gs if g in other and not other[g].lower().endswith(MAYA))
    nf = [g for g in gs if g not in other]
    for m in mb: mb_used[m] += 1
    for m in oth: other_used[m] += 1
    for g in nf: lost[g] += 1
    rows.append((i + 1, l, mb, oth, len(nf)))

for n, l, mb, oth, nf in rows:
    print('%2d W%d-%-2d %-26s maya:%-2d other:%-2d notfound:%d  %s' % (
        n, (n - 1) // 20 + 1, (n - 1) % 20 + 1, l.split('/')[-1], len(mb), len(oth), nf, ', '.join(mb)))
print('')
print('levels referencing at least one unresolved Maya model: %d of %d' % (sum(1 for r in rows if r[2]), len(rows)))
print('distinct Maya models needed: %d' % len(mb_used))
print('  ' + ', '.join('%s(%d)' % kv for kv in mb_used.most_common()))
print('other recoverable files: ' + ', '.join('%s(%d)' % kv for kv in other_used.most_common()))
print('GUIDs found nowhere: %d distinct; most used: %s' % (len(lost), ', '.join('%s(%d)' % (g[:8], n) for g, n in lost.most_common(8))))
