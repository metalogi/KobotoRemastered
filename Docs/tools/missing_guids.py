# -*- coding: utf-8 -*-
# Python 2.7 / 3. Find asset GUIDs referenced by the project's text assets that no .meta in the
# project defines, and report which of them exist in another project folder (e.g. the Unity 4 copy).
# Usage: python Docs/tools/missing_guids.py <project Assets dir> <other Assets dir> [subfolder filter]
import os, re, sys, io
from collections import defaultdict

ASSETS, OTHER = sys.argv[1], sys.argv[2]
FILTER = sys.argv[3] if len(sys.argv) > 3 else ''
guid_re = re.compile(r'^guid:\s*([0-9a-f]{32})', re.M)
ref_re = re.compile(r'guid:\s*([0-9a-f]{32})')

def metas(root):
    out = {}
    for d, _, files in os.walk(root):
        for f in files:
            if f.endswith('.meta'):
                p = os.path.join(d, f)
                try:
                    t = io.open(p, 'r', encoding='latin-1').read(600)
                except Exception:
                    continue
                m = guid_re.search(t)
                if m:
                    out[m.group(1)] = os.path.relpath(p[:-5], root).replace('\\', '/')
    return out

mine, other = metas(ASSETS), metas(OTHER)
BUILTIN = ('0000000000000000', 'f70555f144d8491a825f0804e09c671c', 'f5f67c52d1564df4a8936ccd202a3bd8')
missing = defaultdict(set)
for d, _, files in os.walk(ASSETS):
    for f in files:
        if f.endswith(('.unity', '.prefab', '.mat', '.asset', '.controller', '.anim')):
            p = os.path.join(d, f)
            rel = os.path.relpath(p, ASSETS).replace('\\', '/')
            if FILTER and not rel.startswith(FILTER):
                continue
            with io.open(p, 'r', encoding='latin-1') as fh:
                head = fh.read(5)
                if head != '%YAML':
                    continue
                txt = fh.read()
            for g in set(ref_re.findall(txt)):
                if g not in mine and not g.startswith(BUILTIN):
                    missing[g].add(rel)

found = [(g, other[g], sorted(missing[g])) for g in missing if g in other]
lost = [(g, sorted(missing[g])) for g in missing if g not in other]
print('unresolved GUIDs: %d   recoverable from other project: %d   not found anywhere: %d' % (len(missing), len(found), len(lost)))
print('\n== RECOVERABLE (path in other project  <-  number of referencing files, example)')
for g, path, users in sorted(found, key=lambda x: x[1]):
    print('  %s  %-60s <- %d  e.g. %s' % (g[:8], path, len(users), users[0]))
print('\n== NOT FOUND (guid <- referencing files)')
for g, users in sorted(lost, key=lambda x: -len(x[1])):
    print('  %s <- %d  e.g. %s' % (g, len(users), ', '.join(users[:3])))
