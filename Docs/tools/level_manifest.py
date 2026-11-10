# -*- coding: utf-8 -*-
# Python 2.7. Per-level manifest for original Kubrik scenes: tools offered, creatures spawned.
import os, re, sys, io
from collections import OrderedDict

ROOT = sys.argv[1]
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

def name(g):
    p = guid2path.get(g)
    return os.path.splitext(os.path.basename(p))[0] if p else '?' + g[:6]

comp_block = re.compile(r'^  components:\n((?:  [ -] .*\n|    .*\n)+)', re.M)
entry = re.compile(r'- count: (-?\d+)(.*?)(?=\n  - count:|\Z)', re.S)
child = re.compile(r'childPrefab: \{fileID: \d+, guid: ([0-9a-f]{32})')
core = re.compile(r'coreType: \{fileID: \d+, guid: ([0-9a-f]{32})')
startwith = re.compile(r'startOffWith: \{fileID: \d+, guid: ([0-9a-f]{32})')

for scene in sys.argv[2:]:
    full = os.path.join(ROOT, scene)
    short = scene.replace('Assets/Original/Scenes/', '').replace('.unity', '')
    if not os.path.exists(full):
        print('%s | MISSING FILE' % short)
        continue
    txt = io.open(full, 'r', encoding='utf-8', errors='replace').read().replace('\r\n', '\n')
    tools = []
    for blk in comp_block.findall(txt):
        for cnt, body in entry.findall(blk):
            c = child.search(body)
            tools.append('%s x%s' % (name(c.group(1)) if c else '(none)', cnt))
    cores = [name(g) for g in core.findall(txt)]
    sw = [name(g) for g in startwith.findall(txt)]
    print('%s | tools: %s | kobotos: %s%s' % (short, ', '.join(tools) or '-', ', '.join(cores) or '-', (' | starts with: ' + ', '.join(sw)) if sw else ''))
