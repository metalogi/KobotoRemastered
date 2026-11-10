# -*- coding: utf-8 -*-
# Python 2.7. Generates the 60-level markdown table and writes it into Docs/04-level-inventory.md,
# replacing the '<!-- LEVEL_TABLE -->' marker or the existing table. Level order comes from
# level_missing_assets.py (the Unity 4 build order).
# Usage: python Docs/tools/gen_level_table.py . Docs/04-level-inventory.md
import os, re, sys, io
from collections import OrderedDict

ROOT, DOC = sys.argv[1], sys.argv[2]
ASSETS = os.path.join(ROOT, 'Assets')
guid_re = re.compile(r'^guid:\s*([0-9a-f]{32})', re.M)
guid2path = {}
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith('.meta'):
            p = os.path.join(d, f)
            txt = io.open(p, 'r', encoding='utf-8', errors='replace').read(600)
            m = guid_re.search(txt)
            if m:
                guid2path[m.group(1)] = os.path.relpath(p[:-5], ROOT).replace('\\', '/')

def base(g):
    p = guid2path.get(g)
    return os.path.splitext(os.path.basename(p))[0] if p else None

# level list: build order from the Unity 4 project's EditorBuildSettings (indices 6-65)
lv = io.open(os.path.join(ROOT, 'Docs/tools/level_missing_assets.py'), 'r', encoding='utf-8').read()
names = re.search(r"LEVELS = '''(.*?)'''", lv, re.S).group(1).split()
levels = [(i // 20 + 1, i % 20 + 1, n) for i, n in enumerate(names)]

INFRA = set('''CameraManager GenericFunctions SimManager SoundManagerScript UIEditor UIManager SpawnPoint EndGate
CurvedSurface Connector BonusToken Cloud PauseAction GeneralReset ZoneOfInterest Tutorial2 MaterialSwitcher Anibox
cable butterfly'''.split())

script_ref = re.compile(r'm_Script:\s*\{fileID:\s*-?\d+,\s*guid:\s*([0-9a-f]{32})')
comp_block = re.compile(r'^  components:\n((?:  [ -] .*\n|    .*\n)+)', re.M)
entry = re.compile(r'- count: (-?\d+)(.*?)(?=\n  - count:|\Z)', re.S)
child = re.compile(r'childPrefab: \{fileID: \d+, guid: ([0-9a-f]{32})')
core = re.compile(r'coreType: \{fileID: \d+, guid: ([0-9a-f]{32})')

PORTED = {
    (1, 1): 'Level01', (1, 2): 'Level02', (1, 3): 'Level03', (1, 4): 'Level04', (1, 5): 'Level05',
    (1, 6): 'Level06', (1, 7): 'Level07', (1, 8): 'level08', (1, 9): 'Level09',
    (1, 10): 'Level10', (1, 11): 'EasyJet (partial, not in GameData)',
}

rows = []
for i, (w, slot, rel) in enumerate(levels):
    full = os.path.join(ASSETS, 'Original/Scenes', rel + '.unity')
    if not os.path.exists(full):
        rows.append('| %d | %d | %d | `%s` | *(scene file not in repo)* | | | %s |' % (i + 1, w, slot, rel, PORTED.get((w, slot), '-')))
        continue
    txt = io.open(full, 'r', encoding='utf-8', errors='replace').read().replace('\r\n', '\n')
    tools = []
    for blk in comp_block.findall(txt):
        for cnt, body in entry.findall(blk):
            c = child.search(body)
            n = base(c.group(1)) if c else '?'
            tools.append(n if cnt == '1' else '%s x%s' % (n, cnt))
    kobs = [base(g) or '?' for g in core.findall(txt)]
    mech = OrderedDict()
    for g in script_ref.findall(txt):
        p = guid2path.get(g)
        if p and p.endswith('.js'):
            n = os.path.splitext(os.path.basename(p))[0]
            if n not in INFRA:
                mech[n] = mech.get(n, 0) + 1
    mech_s = ', '.join(sorted(mech.keys(), key=lambda s: s.lower()))
    rows.append('| %d | %d | %d | `%s` | %s | %s | %s | %s |' % (
        i + 1, w, slot, rel, ', '.join(tools) or '-', ', '.join(kobs) or '-', mech_s or '-', PORTED.get((w, slot), '-')))

table = [u'| # | World | Slot | Original scene (under `Assets/Original/Scenes/`) | Tools offered | Kobotos | Level-specific scripts | Remastered scene |',
         '|---|---|---|---|---|---|---|---|'] + rows
doc = io.open(DOC, 'r', encoding='utf-8').read()
marker = '<!-- LEVEL_TABLE -->'
if marker in doc:
    doc = doc.replace(marker, u'\n'.join(table))
else:
    # replace the existing table: from its header line to its last row
    lines = doc.split('\n')
    start = next(i for i, l in enumerate(lines) if l.startswith('| # | World | Slot |'))
    end = start
    while end + 1 < len(lines) and lines[end + 1].startswith('|'):
        end += 1
    doc = u'\n'.join(lines[:start] + table + lines[end + 1:])
io.open(DOC, 'w', encoding='utf-8', newline='\n').write(doc)
print('wrote %d rows' % len(rows))
