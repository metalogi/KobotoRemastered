# -*- coding: utf-8 -*-
# Python 2.7. Summarise which scripts / prefabs each Unity scene references.
import os, re, sys, io, json
from collections import Counter, OrderedDict

ROOT = sys.argv[1]
ASSETS = os.path.join(ROOT, 'Assets')

guid_re = re.compile(r'^guid:\s*([0-9a-f]{32})', re.M)
guid2path = {}
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith('.meta'):
            p = os.path.join(d, f)
            try:
                txt = io.open(p, 'r', encoding='utf-8', errors='replace').read(600)
            except Exception:
                continue
            m = guid_re.search(txt)
            if m:
                guid2path[m.group(1)] = os.path.relpath(p[:-5], ROOT).replace('\\', '/')

script_ref = re.compile(r'm_Script:\s*\{fileID:\s*-?\d+,\s*guid:\s*([0-9a-f]{32})')
prefab_ref = re.compile(r'(?:m_ParentPrefab|m_PrefabParent|m_SourcePrefab|m_CorrespondingSourceObject):\s*\{fileID:\s*-?\d+,\s*guid:\s*([0-9a-f]{32})')
any_ref = re.compile(r'guid:\s*([0-9a-f]{32})')

def analyse(path):
    txt = io.open(path, 'r', encoding='utf-8', errors='replace').read()
    scripts = Counter()
    for g in script_ref.findall(txt):
        scripts[guid2path.get(g, 'MISSING:' + g)] += 1
    prefabs = Counter()
    for g in prefab_ref.findall(txt):
        prefabs[guid2path.get(g, 'MISSING:' + g)] += 1
    missing = set()
    exts = Counter()
    for g in set(any_ref.findall(txt)):
        p = guid2path.get(g)
        if p is None:
            if not g.startswith('0000000000000000'):
                missing.add(g)
        else:
            exts[('Original' if '/Original/' in p else 'Remastered') + os.path.splitext(p)[1].lower()] += 1
    return scripts, prefabs, missing, exts

out = OrderedDict()
for scene in sys.argv[2:]:
    full = os.path.join(ROOT, scene)
    if not os.path.exists(full):
        out[scene] = None
        continue
    s, p, m, e = analyse(full)
    out[scene] = dict(scripts=s, prefabs=p, missing=sorted(m), exts=e)

mode = os.environ.get('MODE', 'full')
for scene, r in out.items():
    print('## ' + scene)
    if r is None:
        print('   (FILE NOT FOUND)')
        continue
    sc = sorted(r['scripts'].items(), key=lambda kv: kv[0])
    print('   scripts: ' + ', '.join('%s x%d' % (os.path.basename(k), v) for k, v in sc))
    if mode == 'full':
        pf = sorted(r['prefabs'].items(), key=lambda kv: kv[0])
        print('   prefabs: ' + ', '.join('%s x%d' % (os.path.basename(k), v) for k, v in pf))
        print('   refs by kind: ' + ', '.join('%s=%d' % kv for kv in sorted(r['exts'].items())))
    if r['missing']:
        print('   missing guids: %d' % len(r['missing']))
